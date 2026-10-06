import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'
import type { Page } from '@playwright/test'

/** Ouvre le dialogue « Ajouter un bien » de /properties. */
async function openDialog(page: Page) {
  await page.goto('/properties')
  await page
    .getByRole('button', { name: 'Ajouter un bien', exact: true })
    .first()
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

/** Clique « Ajouter » dans le dialogue. */
async function submit(page: Page) {
  await page.getByRole('dialog').getByRole('button', { name: /^ajouter$/i }).click()
}

/**
 * Le trou de t_cf156682, au navigateur.
 *
 * `zodResolver(propertySchema)` bloque le submit côté CLIENT : sur une saisie
 * invalide, `handleSubmit` n'appelle jamais la server action, donc aucun toast
 * n'est émis. Le seul retour possible pour l'utilisateur est le message rendu
 * dans le formulaire — et property-form.tsx ne rendait pas `errors.surface` ni
 * `errors.rooms`. Mesuré avant le correctif, pour chacune de ces saisies :
 *
 *     toasts=[]  cree=false  dialogue=ouvert  aria-invalid=null
 *
 * « L'utilisateur clique Ajouter et il ne se passe rien, sans motif. »
 *
 * CE QUE CE SPEC EXIGE, ET POURQUOI CE N'EST PAS REDONDANT
 *
 * Exiger seulement « le bien n'est pas créé » avait laissé passer le défaut :
 * le blocage client satisfaction déjà cette attente, puisque rien n'était
 * créé — mais pour la mauvaise raison, sans que l'utilisateur puisse corriger.
 * Chaque variante exige donc qu'un TEXTE SOIT VISIBLE, rattaché au bon champ.
 *
 * Toutes les variantes sont dans UN seul test, avec UN seul utilisateur
 * enregistré : Better Auth limite à ~6 requêtes auth / 60 s / IP (sign-up ET
 * sign-in confondus), et un test par variante mettait la suite juste à la
 * limite — un échec par bloc, sans rapport avec le code.
 *
 * UNE seule inscription pour tout le fichier, comme property-surface-zero.spec.ts.
 * Better Auth laisse passer ~3 sign-ups par fenetre glissante et compte
 * inscription ET connexion ensemble : trois tests, donc trois inscriptions,
 * etaient a la limite et echouaient en bloc sur le rate-limit — un echec qui
 * ressemble a un formulaire casse sans l'etre. Les etapes s'enchainent donc dans
 * un seul test, dans un ordre fixe, ce qui rend aussi le fichier deterministe
 * quel que soit le nombre de workers.
 */
test.describe('le formulaire explique pourquoi il refuse', () => {
  const VARIANTS = [
    {
      label: 'surface negative',
      fill: async (page: Page) => {
        await page.locator('#surface').fill('-0.5')
      },
      field: '#surface',
      expected: 'La surface doit être strictement positive',
    },
    {
      label: 'nombre de pieces negatif',
      fill: async (page: Page) => {
        await page.locator('#rooms').fill('-1')
      },
      field: '#rooms',
      expected: 'Le nombre de pièces ne peut pas être négatif',
    },
    {
      label: 'nombre de pieces decimal',
      fill: async (page: Page) => {
        await page.locator('#rooms').fill('2.5')
      },
      field: '#rooms',
      expected: 'Le nombre de pièces doit être un entier',
    },
  ]

  test('chaque saisie invalide affiche un message rattache au champ', async ({ page }) => {
    await registerTestUser(page, uniqueEmail('e2e.formerr'))

    for (const variant of VARIANTS) {
      await openDialog(page)
      await page.locator('#name').fill(`Bien ${variant.label}`)
      await page.locator('#addressLine1').fill('12 Rue de Rivoli')
      await page.locator('#city').fill('Lyon')
      await page.locator('#postalCode').fill('69001')
      await variant.fill(page)

      await submit(page)

      // 1. Le motif est VISIBLE, en francais, et dit quoi corriger.
      await expect(
        page.getByText(variant.expected, { exact: false }),
        `aucun message visible pour : ${variant.label}`,
      ).toBeVisible({ timeout: 15_000 })

      // 2. Le champ fautif est marque, et relie a son message (lecteur d'ecran).
      const field = page.locator(variant.field)
      await expect(field).toHaveAttribute('aria-invalid', 'true')

      const describedBy = await field.getAttribute('aria-describedby')
      expect(describedBy, `${variant.field} sans aria-describedby`).toBeTruthy()
      await expect(
        page.locator(`#${describedBy}`),
        `${variant.field} ne pointe vers aucun message`,
      ).toHaveText(variant.expected)

      // 3. Le bien n'est PAS cree — le refus reste un refus.
      await expect(page.getByRole('dialog')).toBeVisible()

      // Le dialogue n'a qu'un bouton (« Ajouter ») : on le ferme par Escape,
      // pas en cherchant un « Annuler » qui n'existe pas.
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toBeHidden()
    }

    // ── Un texte trop long : ici le navigateur suffit, avant le submit ────────
    // Le plafond du schema porte desormais sur l'attribut HTML : la frappe
    // s'arrete a 2000 caracteres et l'utilisateur voit son texte se plafonner,
    // au lieu d'un clic sans effet apres coup. Le bien se cree quand meme — un
    // plafond n'est pas un blocage.
    const capped = `Studio trop long-${Date.now()}`
    await openDialog(page)
    await page.locator('#name').fill(capped)
    await page.locator('#addressLine1').fill('12 Rue de Rivoli')
    await page.locator('#city').fill('Lyon')
    await page.locator('#postalCode').fill('69001')

    const description = page.locator('#description')
    await description.click()
    await description.pressSequentially('a'.repeat(2100), { delay: 0 })
    expect(
      (await description.inputValue()).length,
      'la saisie n-a pas ete plafonnee a 2000 caracteres',
    ).toBe(2000)

    await submit(page)
    await expect(page.getByText(capped, { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    })

    // ── Une saisie valide : aucun message ne doit subsister ─────────────────
    const valid = `Studio valide-${Date.now()}`
    await openDialog(page)
    await page.locator('#name').fill(valid)
    await page.locator('#addressLine1').fill('12 Rue de Rivoli')
    await page.locator('#city').fill('Lyon')
    await page.locator('#postalCode').fill('69001')
    await page.locator('#surface').fill('65.5')
    await page.locator('#rooms').fill('3')

    await submit(page)
    await expect(page.getByText(valid, { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    })
    // Aucun message résiduel : le formulaire ne bavarde pas quand tout va bien.
    await expect(
      page.getByText('La surface doit être strictement positive'),
    ).toHaveCount(0)
  })
})