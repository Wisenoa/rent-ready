import { chromium, Page } from '@playwright/test'

/**
 * Test user credentials used across E2E tests.
 * Users are created via the registration API during test setup.
 */
export const TEST_USER = {
  email: `e2e.test.${Date.now()}@rentready.io`,
  password: 'TestPassword123!',
  firstName: 'Jean',
  lastName: 'Dupont',
}

/**
 * Register a new test user via the registration form.
 * Returns the same credentials used for registration.
 */
export async function registerTestUser(page: Page) {
  await page.goto('/register')
  await page.fill('[id="firstName"]', TEST_USER.firstName)
  await page.fill('[id="lastName"]', TEST_USER.lastName)
  await page.fill('[id="email"]', TEST_USER.email)
  await page.fill('[id="password"]', TEST_USER.password)
  await page.fill('[id="confirmPassword"]', TEST_USER.password)
  await page.click('[type="submit"]')
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 15_000 })
}

/**
 * Log in an existing test user via the login form.
 */
export async function loginTestUser(page: Page, email = TEST_USER.email, password = TEST_USER.password) {
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
