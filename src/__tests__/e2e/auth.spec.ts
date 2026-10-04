import { test, expect } from './helpers/fixtures'
import { TEST_USER, loginTestUser, registerTestUser, uniqueEmail, logoutTestUser } from './helpers/auth'

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
    // The password is passed to BOTH calls, and to register it explicitly.
    //
    // This spec registered without a password, so the account was created with
    // the helper's DEFAULT_PASSWORD ('RentReady!2026'), then signed in with
    // 'TestPassword123!' — a string that appears nowhere else in this suite and
    // had been carried over from another project. The two did not match, so the
    // sign-in could never succeed and the test was not testing authentication.
    //
    // It could still go green: `loginTestUser` ends on
    // `waitForURL('**\/dashboard**')`, and if a previous step left the browser
    // on /dashboard, that predicate is already true before the click. The
    // assertion `toHaveURL(/\/dashboard/)` then passes without a session ever
    // being created. A test that passes for the wrong reason is worse than one
    // that fails, because it reports coverage that does not exist.
    const password = 'MotDePasse!Correct2026'
    const accountEmail = uniqueEmail('login')
    await registerTestUser(page, accountEmail, password)
    // Sign out through the UI — see the other test: a `goto('/login')` here keeps
    // the session and redirects straight back to the dashboard.
    await logoutTestUser(page)

    // Now login with the registered user
    await loginTestUser(page, accountEmail, password)
    await expect(page).toHaveURL(/\/dashboard/)
    // Proof the session is real: an authenticated page, not a URL that merely
    // looks right. /dashboard redirects an anonymous visitor to /login.
    await expect(page.getByRole('button', { name: /profil|compte|avatar/i }).first()).toBeVisible()
  })

  test('login with wrong password shows error', async ({ page }) => {
    const accountEmail = uniqueEmail('wrong')
    // Register first
    await registerTestUser(page, accountEmail)

    // Sign out THROUGH THE UI: navigating to /login keeps the session, redirects
    // back to /dashboard, and the test then timed out on the onboarding wizard
    // rather than on the password it meant to check.
    await logoutTestUser(page)
    await page.fill('[id="email"]', accountEmail)
    await page.fill('[id="password"]', 'WrongPassword123!')
    await page.click('[type="submit"]')

    // The message must be French. Better Auth answers with an English
    // `message`, and the form used to render that verbatim — measured on the
    // running app: the toast read "Invalid email or password" on a product
    // whose whole interface is French.
    const error = page.getByTestId('login-error')
    await expect(error).toBeVisible({ timeout: 10_000 })
    await expect(error).toHaveText(/adresse email ou mot de passe incorrect/i)

    // And it must still be there a minute later. The error used to live only in
    // a toast that expired after ~4s, so a user who looked away came back to a
    // form that looked like it had done nothing.
    await page.waitForTimeout(6000)
    await expect(error).toBeVisible()

    // No English anywhere in the visible message.
    const text = await error.innerText()
    expect(text).not.toMatch(/invalid|incorrect password|user not found/i)
  })
})
