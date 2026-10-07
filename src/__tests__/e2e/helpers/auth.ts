import { Page } from '@playwright/test'

/** A fresh identity per test, so specs cannot interfere via the database. */
export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@rentready.io`
}

export const DEFAULT_PASSWORD = 'RentReady!2026'

/**
 * Sign the current user out through the UI.
 *
 * Navigating to /login is NOT a logout: the session cookie is still there, so the
 * route redirects back to /dashboard and any `fill()` then waits on the onboarding
 * wizard until the test times out. Sign-out only exists in the user menu, so it has
 * to go through it.
 */
export async function logoutTestUser(page: Page): Promise<void> {
  await page.goto('/dashboard')
  await dismissOnboarding(page)

  // Located by its slot, not by role: the wizard dialog traps focus, and while it
  // is mounted the trigger is technically visible but not actionable, so a
  // role-based click waits forever. `dismissOnboarding` above is what clears it;
  // the slot is used because it survives whichever way the dialog closes.
  const menu = page.locator('[data-slot="dropdown-menu-trigger"]').first()
  // `force` for the same reason as the dialog close: the dashboard animates, so
  // the trigger is never "stable" for Playwright and the wait ends in a timeout
  // that names nothing.
  await menu.click({ timeout: 15_000, force: true })

  // Waited on the ITEM, not on a sleep and not on the trigger's `aria-expanded`:
  // measured under a parallel run, the trigger reported expanded while the popup
  // had not mounted, so waiting on it passed and the item was still absent.
  // The item existing IS the fact.
  await page
    .locator('[data-slot="dropdown-menu-item"]')
    .first()
    .waitFor({ state: 'visible', timeout: 15_000 })
    .catch(async () => {
      throw new Error(
        `le menu du compte ne s'est pas ouvert (trigger aria-expanded=` +
          `${await menu.getAttribute('aria-expanded')}, url=${page.url()})`,
      )
    })

  // The onboarding dialog's OVERLAY covers the whole page. The menu opens
  // underneath it, so a click on « Se déconnecter » reaches the overlay and
  // nothing else — no handler runs, no error is raised, and the session survives.
  // Measured: elementFromPoint at the item's centre returned
  // `<DIV slot=dialog-overlay>`, not the item.
  //
  // The dismissal is written to localStorage by the wizard's own close handler, so
  // it is set here as well: this helper's job is to get the menu reachable, not
  // to re-test the wizard.
  await page.evaluate(() => {
    localStorage.setItem('onboarding_wizard_dismissed', '1')
  })
  await dismissOnboarding(page)

  // Base UI's menu items are plain elements, not `role="menuitem"` — measured on
  // the DOM, not assumed — so the text is the reliable handle.
  const signOut = page.getByText(/se d[eé]connecter/i).first()
  await signOut.waitFor({ state: 'visible', timeout: 10_000 })
  await signOut.click({ force: true })
  // Leaving the dashboard is the proof the session ended: /dashboard redirects a
  // signed-out visitor to /login, so a URL that stays put means the cookie is
  // still there, whatever the client believes.
  await page
  .waitForURL((url) => !url.pathname.startsWith('/dashboard'), { timeout: 20_000 })
  .catch(async () => {
    const cookies = await page.context().cookies()
    throw new Error(
      `deconnexion : bloque sur ${page.url()} | cookies=${cookies
        .map((c) => c.name)
        .join(",")}`,
    )
  })
  await page.waitForTimeout(500)
  // Measured, not assumed: sign-out does not necessarily land on /login, and a
  // wrong expectation here fails with a bare timeout that names nothing.
  await page
    .waitForURL((url) => !url.pathname.startsWith('/dashboard'), { timeout: 30_000 })
    .catch(() => {
      throw new Error(
        `deconnexion : toujours sur ${page.url()} — le menu s'ouvre mais la session reste active`,
      )
    })
}

/**
 * Close the onboarding wizard if it opened.
 *
 * It auto-shows 300ms after landing on /dashboard for an account with no
 * property, and an open modal makes every later `fill()` on the same tab wait
 * for actionability until the test times out — with no message about why. That
 * is what made six E2E tests fail on a timeout rather than on a real defect.
 *
 * No-op when the wizard never mounted, so it is safe to call unconditionally.
 */
export async function dismissOnboarding(page: Page): Promise<void> {
  // By slot, not by accessible name: the wizard's close control carries only a
  // visually-hidden « Close », and Base UI's animated mount means a
  // visibility-based lookup races the animation.
  //
  // `force: true` because the dialog's open/close transition never settles on a
  // dev build under test, and Playwright otherwise waits for stability until the
  // whole test times out — with nothing pointing at the actual blocker.
  const close = page.locator('[data-slot="dialog-close"]').first();
  try {
    if (await close.isVisible({ timeout: 2_000 })) {
      await close.click({ force: true });
      await page.waitForFunction(
        () => document.querySelectorAll('[data-slot="dialog-close"]').length === 0,
        undefined,
        { timeout: 5_000 },
      ).catch(() => {});
    }
  } catch {
    // The wizard is optional. A test that needs it opens it itself.
  }
}

/**
 * Kept for the existing specs that import it. Its email is no longer shared
 * between tests — registerTestUser generates a fresh address per call — so this
 * is a placeholder for specs that want a known identity rather than a default.
 */
export const TEST_USER = {
  email: uniqueEmail('e2e'),
  password: DEFAULT_PASSWORD,
  name: 'Jean Dupont',
  get firstName() {
    return this.name.split(' ')[0]
  },
  get lastName() {
    return this.name.split(' ').slice(1).join(' ')
  },
}

/**
 * Register a new test user through the real form.
 *
 * The form has ONE `name` field (first/last are split server-side) and no
 * confirmPassword. The previous version of this helper filled `[id="firstName"]`,
 * `[id="lastName"]` and `[id="confirmPassword"]` — none of which exist — so every
 * spec that used it failed at the first fill. That went unnoticed because
 * Playwright is not run in CI.
 *
 * Returns once the dashboard is reached, which is the meaningful assertion: it
 * only appears when the account was created AND the session cookie was set.
 * Before the auth-origin fix, registration created the account and left the user
 * stranded on /register with no error, so this waitForURL catches that class.
 */
export async function registerTestUser(
  page: Page,
  email = uniqueEmail('e2e'),
  password = DEFAULT_PASSWORD,
  name = 'Jean Dupont',
): Promise<{ email: string; password: string; name: string }> {
  await dismissOnboarding(page);
  await page.goto('/register');

  await page.getByLabel(/nom complet/i).fill(name)
  await page.getByLabel(/adresse email/i).fill(email)
  await page.getByLabel(/mot de passe/i).fill(password)

  // No cookie-banner handling here. The banner mounts only after DELAY_MS
  // (1500ms), so "is it visible yet?" was a race: the check ran on page N and
  // the banner appeared on page N+1, over the next button. It is now settled
  // before the first navigation by helpers/fixtures.ts, so it never mounts.
  await page.getByRole('button', { name: /cr[ée]er mon compte/i }).click()
  await page.waitForURL('**/dashboard**', { timeout: 30_000 })

  return { email, password, name }
}

/** Log in an existing user through the login form. */
export async function loginTestUser(
  page: Page,
  email: string,
  password = DEFAULT_PASSWORD,
): Promise<void> {
  // The onboarding wizard auto-opens 300ms after landing on /dashboard for an
  // account with no properties, and a modal left open makes every later
  // `fill()` on this page wait forever for actionability. Navigating away does
  // not close it — it is the same tab, and the dismissal is only written when the
  // user closes it. Dismissed here so a login test is not testing the wizard.
  await dismissOnboarding(page);
  await page.goto('/login')
  await page.getByLabel(/adresse email/i).fill(email)
  await page.getByLabel(/mot de passe/i).fill(password)

  await page.getByRole('button', { name: /se connecter/i }).click()

  // Waited on LEAVING /login, not on arriving at /dashboard.
  //
  // `waitForURL('**\/dashboard**')` is satisfied instantly if the browser is
  // already on /dashboard, so it passes without any session existing. That is
  // not hypothetical: `auth.spec.ts` signed in with a password that did not match
  // the one the account was created with, and this predicate plus
  // `toHaveURL(/\/dashboard/)` let it report green while authentication was
  // never exercised.
  //
  // Leaving /login is the fact: on a wrong password the page stays put, which is
  // what the failure message then describes.
  await page
    .waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 })
    .catch(async () => {
      const visible = await page
        .getByTestId('login-error')
        .textContent()
        .catch(() => null);
      throw new Error(
        `connexion : toujours sur ${page.url()} — le mot de passe a ete rejete` +
          (visible ? ` (« ${visible.trim()} »)` : ' sans message a l ecran'),
      );
    })
}

/** Create a property through its dialog on /properties. */
export async function createProperty(
  page: Page,
  property: {
    name: string
    addressLine1: string
    city: string
    postalCode: string
    surface?: number
    rooms?: number
  },
): Promise<void> {
  await page.goto('/properties')
  // exact: the page also has "Ajouter un bien manuellement", which a substring
  // match would collide with under strict mode.
  await page
    .getByRole('button', { name: 'Ajouter un bien', exact: true })
    .first()
    .click()

  await page.locator('#name').fill(property.name)
  await page.locator('#addressLine1').fill(property.addressLine1)
  await page.locator('#city').fill(property.city)
  await page.locator('#postalCode').fill(property.postalCode)
  if (property.surface !== undefined || property.rooms !== undefined) {
    const extraDetails = page.getByRole('button', { name: /informations compl[ée]mentaires/i })
    if (await extraDetails.isVisible()) {
      await extraDetails.click()
    }
  }
  if (property.surface !== undefined) {
    await page.locator('#surface').fill(String(property.surface))
  }
  if (property.rooms !== undefined) {
    await page.locator('#rooms').fill(String(property.rooms))
  }

  await page.getByRole('button', { name: /^(ajouter|cr[ée]er|enregistrer|cr[ée]er le logement)$/i }).last().click()
  await page.getByText(property.name, { exact: false }).first().waitFor({ timeout: 15_000 })

  // A dev server recompiles the next route on first request, and the navigation
  // can be aborted mid-flight (net::ERR_ABORTED). Give it one settle before the
  // test moves on, or the next goto races the compile.
  await page.waitForLoadState('networkidle').catch(() => {})
}

/** Create a tenant through its dialog on /tenants. */
export async function createTenant(
  page: Page,
  tenant: {
    firstName: string
    lastName: string
    email?: string
    addressLine1?: string
    city?: string
    postalCode?: string
  },
): Promise<void> {
  await page.goto('/tenants')
  // The page renders this trigger twice (empty state and toolbar); strict mode
  // refuses an ambiguous match, so pick the first that is actually visible.
  await page
    .getByRole('button', { name: 'Ajouter un locataire', exact: true })
    .first()
    .click()

  await page.getByLabel(/pr[ée]nom/i).fill(tenant.firstName)
  await page.getByLabel(/^nom/i).fill(tenant.lastName)
  if (tenant.email) {
    await page.getByLabel(/^email/i).fill(tenant.email)
  }
  // Address, city and postal code are required. Leaving them blank does not
  // submit: the form validates and stays open, showing "L'adresse est requise"
  // and "Code postal invalide" beneath the fields.
  await page.getByLabel(/^adresse/i).fill(tenant.addressLine1 ?? '5 avenue Foch')
  await page.getByLabel(/ville/i).fill(tenant.city ?? 'Paris')
  await page.getByLabel(/code postal/i).fill(tenant.postalCode ?? '75016')

  // The submit button reads "Ajouter", the same as the trigger that opened this
  // dialog, so scope it to the dialog rather than the page.
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /^ajouter$/i })
    .click()
  await page.getByText(tenant.lastName, { exact: false }).first().waitFor({ timeout: 15_000 })
  await page.waitForLoadState('networkidle').catch(() => {})
}

/**
 * Choose an option in a base-ui `<Select>`.
 *
 * base-ui renders a combobox trigger plus a listbox popup rather than a native
 * `<select>`, so `selectOption` does not apply. Clicking the trigger and then the
 * option is the only faithful way to drive it — synthetic events do not reliably
 * activate it, which is also why this step cannot be shortcut from a unit test.
 */
export async function selectOption(
  page: Page,
  triggerId: string,
  optionText: string | RegExp,
): Promise<void> {
  await page.locator(`#${triggerId}`).click()

  const popup = page.locator('[role="listbox"]').last()
  await popup.waitFor({ state: 'visible', timeout: 10_000 })

  await popup.locator('[role="option"]').filter({ hasText: optionText }).first().click()
  await popup.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {})
}

/** Save authentication state so later specs can reuse the session. */
export async function saveAuthState(page: Page, filePath: string): Promise<void> {
  await page.context().storageState({ path: filePath })
}

/**
 * Navigate, tolerating the dev server's first-request compile.
 *
 * A route that has never been requested is compiled on demand, and the navigation
 * aborts while it happens (net::ERR_ABORTED). This retries until the route
 * answers, so the test is not coupled to dev-server warm-up order. It matters for
 * CI too, where the first hit on each route is always cold.
 */
export async function gotoStable(page: Page, url: string): Promise<void> {
  const deadline = Date.now() + 45_000
  let lastError: unknown

  while (Date.now() < deadline) {
    const response = await page.goto(url).catch((error) => {
      lastError = error
      return null
    })
    if (response?.ok()) return
    // An abort may still have landed the page; give the route a moment to finish
    // compiling before trying again.
    await page.waitForTimeout(500)
  }

  throw new Error(
    `could not load ${url} after repeated attempts: ${String(lastError)}`,
  )
}
