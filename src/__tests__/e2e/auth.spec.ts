import { test, expect } from './helpers/fixtures'
import { TEST_USER, loginTestUser, registerTestUser, uniqueEmail } from './helpers/auth'

test.describe('Authentication Flow', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /bienvenue/i })).toBeVisible()
    await expect(page.getByLabel(/adresse email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
  })

  test('register page loads correctly', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /créer un compte/i })).toBeVisible()
    // The form asks for a full name, not a first name: there is no « prénom »
    // field, and a test looking for one fails against a page that is correct.
    await expect(page.getByLabel(/nom complet/i)).toBeVisible()
    await expect(page.getByLabel(/nom/i)).toBeVisible()
    await expect(page.getByLabel(/adresse email/i)).toBeVisible()
  })

  test('can register a new user and redirect to dashboard', async ({ page }) => {
    // Use a unique email per test run to avoid conflicts
    const accountEmail = uniqueEmail('reg')
    await registerTestUser(page, accountEmail)
    // Should redirect to dashboard after successful registration
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    // First register a user
    const accountEmail = uniqueEmail('login')
        await registerTestUser(page, accountEmail)
    // Logout
    await page.goto('/login')

    // Now login with the registered user
    await loginTestUser(page, accountEmail, 'TestPassword123!')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('login with wrong password shows error', async ({ page }) => {
    const accountEmail = uniqueEmail('wrong')
    // Register first
    await registerTestUser(page, accountEmail)

    // Logout and try with wrong password
    await page.goto('/login')
    await page.fill('[id="email"]', accountEmail)
    await page.fill('[id="password"]', 'WrongPassword123!')
    await page.click('[type="submit"]')

    // Should show error toast or message
    await expect(page.getByText(/identifiants incorrects|mot de passe/i)).toBeVisible({ timeout: 5000 })
  })
})
