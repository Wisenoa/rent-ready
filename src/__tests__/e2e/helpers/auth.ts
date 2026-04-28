import { Page } from '@playwright/test'

export const TEST_USER = {
  email: `e2e.test.${Date.now()}@rentready.io`,
  password: 'TestPassword123!',
  firstName: 'Jean',
  lastName: 'Dupont',
}

/**
 * Register a new test user via the registration form.
 * Returns the credentials used for registration.
 */
export async function registerTestUser(
  page: Page,
  email = TEST_USER.email,
  password = TEST_USER.password,
  firstName = TEST_USER.firstName,
  lastName = TEST_USER.lastName,
) {
  await page.goto('/register')
  await page.fill('[id="firstName"]', firstName)
  await page.fill('[id="lastName"]', lastName)
  await page.fill('[id="email"]', email)
  await page.fill('[id="password"]', password)
  await page.fill('[id="confirmPassword"]', password)
  await page.click('[type="submit"]')
  await page.waitForURL('**/dashboard**', { timeout: 15_000 })
}

/**
 * Log in an existing test user via the login form.
 */
export async function loginTestUser(
  page: Page,
  email = TEST_USER.email,
  password = TEST_USER.password,
) {
  await page.goto('/login')
  await page.fill('[id="email"]', email)
  await page.fill('[id="password"]', password)
  await page.click('[type="submit"]')
  await page.waitForURL('**/dashboard**', { timeout: 15_000 })
}

/**
 * Save authentication state to a file so tests can reuse a logged-in session.
 */
export async function saveAuthState(page: Page, filePath: string) {
  await page.context().storageState({ path: filePath })
}
