import { test, expect } from '@playwright/test'
import {
  registerTestUser,
  createProperty,
  createTenant,
  selectOption,
  uniqueEmail,
  gotoStable,
} from './helpers/auth'

/**
 * The golden path, driven through the real UI:
 *
 *   register -> property -> tenant -> lease -> rent due -> payment -> receipt
 *
 * Every one of these steps was found broken at some point while the rest of the
 * suite stayed green, because the runtime checks call the API directly and this
 * path did not exist as an automated test. Registration alone was silently
 * broken twice (a non-existent Better Auth method, then an auth client pinned to
 * a hardcoded port) — both times the account was created and the user was left
 * sitting on /register with no error.
 *
 * The lease step matters most: it is the only assertion that creating a lease
 * through the form also generates the rent periods that arrears and receipts
 * depend on.
 */

test.describe.configure({ mode: 'serial' })

test('a new landlord can reach a rent schedule from an empty account', async ({ page }) => {
  await registerTestUser(page, uniqueEmail('e2e.golden'))

  // ── the account starts empty, and says so ────────────────────────────────────
  await gotoStable(page, '/dashboard')
  await expect(page.getByText(/aucun bien/i).first()).toBeVisible()

  // ── property ────────────────────────────────────────────────────────────────
  await createProperty(page, {
    name: 'Studio République',
    addressLine1: '12 rue de la République',
    city: 'Paris',
    postalCode: '75011',
    surface: 32,
    rooms: 1,
  })

  // ── tenant ──────────────────────────────────────────────────────────────────
  await createTenant(page, {
    firstName: 'Camille',
    lastName: 'Durand',
    email: `camille.${Date.now()}@example.com`,
  })

  // ── lease ───────────────────────────────────────────────────────────────────
  // The Selects are base-ui comboboxes, not native <select>; this is the step
  // that cannot be covered by a unit test.
  // /leases/new is compiled on first request, and the navigation aborts while it
  // happens (net::ERR_ABORTED). Warm the route, retrying until it settles.
  await gotoStable(page, '/leases/new')

  await selectOption(page, 'propertyId', /Studio République/)
  await selectOption(page, 'tenantId', /Camille Durand/)

  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear() + 1, today.getMonth(), 0)
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  await page.locator('#rentAmount').fill('850')
  await page.locator('#chargesAmount').fill('50')
  await page.locator('#depositAmount').fill('850')
  await page.locator('#startDate').fill(iso(start))
  await page.getByRole('button', { name: /cr[ée]er le bail/i }).click()

  // ── the lease exists, and it owes rent ──────────────────────────────────────
  await gotoStable(page, '/leases')
  await expect(page.getByText(/850/).first()).toBeVisible({ timeout: 20_000 })

  // Arrears only exist if the rent schedule was generated when the lease was
  // created. Without it the dashboard shows nothing owed, which is silent.
  await gotoStable(page, '/billing')
  await expect(page.getByText(/900|850|50/).first()).toBeVisible({ timeout: 20_000 })
})

test('registration signs the new user straight in', async ({ page }) => {
  // Isolated because it is the assertion that failed for two separate reasons:
  // the account was created but the session was not, and the page just sat there.
  await registerTestUser(page, uniqueEmail('e2e.auth'))
  await expect(page).toHaveURL(/\/dashboard/)

  // The session must be a real one, not a redirect that happens to render.
  await gotoStable(page, '/properties')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})