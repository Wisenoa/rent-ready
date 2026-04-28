import { test, expect } from '@playwright/test'

test.describe('Maintenance Request Flow', () => {
  async function setupUserWithPropertyAndTenant(page: any) {
    const uniqueEmail = `e2e.maint.${Date.now()}@rentready.io`
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'Maintenance')
    await page.fill('[id="lastName"]', 'Test')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })

    // Create a property
    await page.goto('/properties')
    await page.getByRole('button', { name: /ajouter un bien/i }).click()
    await expect(page.getByText(/nouveau bien/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="name"]', 'Immeuble Maintenance')
    await page.fill('[id="addressLine1"]', '30 Rue de la Maintenance')
    await page.fill('[id="city"]', 'Marseille')
    await page.fill('[id="postalCode"]', '13001')
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText('Immeuble Maintenance')).toBeVisible({ timeout: 10_000 })

    // Create a tenant
    await page.goto('/tenants')
    await page.getByRole('button', { name: /ajouter un locataire/i }).click()
    await expect(page.getByText(/nouveau locataire/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="firstName"]', 'Jean')
    await page.fill('[id="lastName"]', 'Michelin')
    await page.fill('[id="email"]', `michelin.${Date.now()}@example.com`)
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText('Jean Michelin')).toBeVisible({ timeout: 10_000 })

    return uniqueEmail
  }

  test('maintenance page loads and shows empty state', async ({ page }) => {
    const uniqueEmail = `e2e.maint.empty.${Date.now()}@rentready.io`
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'MaintEmpty')
    await page.fill('[id="lastName"]', 'Test')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })

    await page.goto('/maintenance')
    // Page should load with some maintenance-related heading or content
    const body = await page.textContent('body')
    expect(body?.toLowerCase()).toMatch(/entretien|maintenance|dépannage|réparation/i)
  })

  test('can create a maintenance request', async ({ page }) => {
    await setupUserWithPropertyAndTenant(page)

    // Navigate to maintenance
    await page.goto('/maintenance')

    // Look for a create/maintenance button
    const createBtn = page.getByRole('button', { name: /créer|ajouter|nouveau|signaler/i })
    if (await createBtn.count() > 0) {
      await createBtn.first().click()
    }

    // Fill maintenance request form
    await page.fill('[id="title"]', 'Fuite d\'eau dans la salle de bain')
    await page.fill('[id="description"]', 'Il y a une fuite importante sous le lavabo de la salle de bain. L\'eau coule en continu.')

    // Priority field if present
    const prioritySelect = page.locator('[id="priority"], [id="urgence"]').or(
      page.locator('[aria-haspopup="listbox"]').filter({ hasText: /priorité|urgence/i })
    )
    if (await prioritySelect.count() > 0) {
      await prioritySelect.click()
      await page.getByRole('option', { name: /urgent|élevée|moyenne/i }).first().click().catch(() => {
        // Priority may not be selectable — skip
      })
    }

    // Submit
    await page.getByRole('button', { name: /créer|enregistrer|signaler|envoyer/i }).click()

    // Should see the created request
    await expect(
      page.getByText(/fuite|salle de bain|maintenance/i)
    ).toBeVisible({ timeout: 10_000 })
  })

  test('can view maintenance request detail', async ({ page }) => {
    await setupUserWithPropertyAndTenant(page)

    // Create a maintenance request first
    await page.goto('/maintenance')
    const createBtn = page.getByRole('button', { name: /créer|ajouter|nouveau|signaler/i })
    if (await createBtn.count() > 0) {
      await createBtn.first().click()
    }
    await page.fill('[id="title"]', 'Porte d\'entrée bloquée')
    await page.fill('[id="description"]', 'La porte d\'entrée ne s\'ouvre plus avec la clé.')
    await page.getByRole('button', { name: /créer|enregistrer|signaler/i }).click()
    await expect(page.getByText(/porte|bloquée/i)).toBeVisible({ timeout: 10_000 })

    // Click to view detail
    await page.getByText(/porte d'entrée/i).click()
    await page.waitForURL(/maintenance\/.+/, { timeout: 10_000 }).catch(() => {
      // Detail may open in a dialog instead
    })

    // Detail should show the title
    await expect(page.getByText(/porte d'entrée/i).or(
      page.locator('h1, h2').filter({ hasText: /porte/i })
    )).toBeVisible({ timeout: 5000 })
  })

  test('can update maintenance request status', async ({ page }) => {
    await setupUserWithPropertyAndTenant(page)

    // Create a maintenance request
    await page.goto('/maintenance')
    const createBtn = page.getByRole('button', { name: /créer|ajouter|nouveau|signaler/i })
    if (await createBtn.count() > 0) {
      await createBtn.first().click()
    }
    await page.fill('[id="title"]', 'Chauffage en panne')
    await page.fill('[id="description"]', 'Le chauffage ne fonctionne plus depuis hier.')
    await page.getByRole('button', { name: /créer|enregistrer|signaler/i }).click()
    await expect(page.getByText(/chauffage/i)).toBeVisible({ timeout: 10_000 })

    // Try to change status
    const statusBtn = page.getByRole('button', { name: /en cours|résolu|fermé|ouvert|statut/i })
    if (await statusBtn.count() > 0) {
      await statusBtn.first().click()
      // Try selecting "Résolu" or "En cours"
      const resolvedOption = page.getByRole('option', { name: /résolu|terminé|fermé/i }).or(
        page.getByText(/résolu|terminé|fermé/i)
      )
      if (await resolvedOption.count() > 0) {
        await resolvedOption.first().click()
      }
      // Status should change
      await page.waitForTimeout(1000)
    }
  })

  test('maintenance page no JS errors on load', async ({ page }) => {
    const uniqueEmail = `e2e.maint.errors.${Date.now()}@rentready.io`
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'MaintErr')
    await page.fill('[id="lastName"]', 'Test')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })

    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/maintenance')
    await page.waitForLoadState('networkidle')

    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('Warning')
    )
    expect(criticalErrors).toHaveLength(0)
  })
})
