import { Page } from '@playwright/test'

/** A fresh identity per test, so specs cannot interfere via the database. */
export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@rentready.io`
}

export const DEFAULT_PASSWORD = 'RentReady!2026'

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
  await page.goto('/register')

  await page.getByLabel(/nom complet/i).fill(name)
  await page.getByLabel(/adresse email/i).fill(email)
  await page.getByLabel(/mot de passe/i).fill(password)

  // The cookie banner can sit over the submit button.
  const accept = page.getByRole('button', { name: /accepter/i })
  if (await accept.isVisible().catch(() => false)) {
    await accept.click()
  }

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
  await page.goto('/login')
  await page.getByLabel(/adresse email/i).fill(email)
  await page.getByLabel(/mot de passe/i).fill(password)

  const accept = page.getByRole('button', { name: /accepter/i })
  if (await accept.isVisible().catch(() => false)) {
    await accept.click()
  }

  await page.getByRole('button', { name: /se connecter/i }).click()
  await page.waitForURL('**/dashboard**', { timeout: 30_000 })
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
  if (property.surface !== undefined) {
    await page.locator('#surface').fill(String(property.surface))
  }
  if (property.rooms !== undefined) {
    await page.locator('#rooms').fill(String(property.rooms))
  }

  await page.getByRole('button', { name: /^(ajouter|cr[ée]er|enregistrer)$/i }).last().click()
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
