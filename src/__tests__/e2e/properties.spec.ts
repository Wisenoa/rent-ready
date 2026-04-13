import { test, expect } from '@playwright/test'
import { registerTestUser, loginTestUser } from './helpers/auth'

test.describe('Property Management', () => {
  const testProperty = {
    name: 'Appartement Paris 11e',
    type: 'APARTMENT',
    addressLine1: '12 Rue de la Roquette',
    city: 'Paris',
    postalCode: '75011',
    surface: 45,
    rooms: 2,
  }

  test.beforeEach(async ({ page }) => {
    // Register and login before each property test
    const uniqueEmail = `e2e.prop.${Date.now()}@rentready.io`
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'Proprio')
    await page.fill('[id="lastName"]', 'Test')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })
  })

  test('properties page loads with empty state', async ({ page }) => {
    await page.goto('/properties')
    await expect(page.getByRole('heading', { name: /mes biens/i })).toBeVisible()
    // Empty state should show "Ajouter un bien" button
    await expect(page.getByRole('button', { name: /ajouter un bien/i })).toBeVisible()
  })

  test('can create a new property', async ({ page }) => {
    await page.goto('/properties')

    // Click "Ajouter un bien" button to open the dialog
    await page.getByRole('button', { name: /ajouter un bien/i }).click()

    // Dialog should open
    await expect(page.getByText(/nouveau bien|ajouter un bien/i)).toBeVisible({ timeout: 5000 })

    // Fill in property form
    await page.fill('[id="name"]', testProperty.name)
    await page.fill('[id="addressLine1"]', testProperty.addressLine1)
    await page.fill('[id="city"]', testProperty.city)
    await page.fill('[id="postalCode"]', testProperty.postalCode)
    await page.fill('[id="surface"]', String(testProperty.surface))
    await page.fill('[id="rooms"]', String(testProperty.rooms))

    // Submit form
    await page.getByRole('button', { name: /créer|ajouter|enregistrer/i }).click()

    // Should see success feedback and property in list
    await expect(page.getByText(testProperty.name)).toBeVisible({ timeout: 10_000 })
  })

  test('property detail page loads after creation', async ({ page }) => {
    // Create property first
    await page.goto('/properties')
    await page.getByRole('button', { name: /ajouter un bien/i }).click()
    await expect(page.getByText(/nouveau bien/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="name"]', testProperty.name)
    await page.fill('[id="addressLine1"]', testProperty.addressLine1)
    await page.fill('[id="city"]', testProperty.city)
    await page.fill('[id="postalCode"]', testProperty.postalCode)
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText(testProperty.name)).toBeVisible({ timeout: 10_000 })

    // Click on the property to view detail
    await page.getByText(testProperty.name).click()
    await page.waitForURL(/\/properties\/[^/]+$/, { timeout: 10_000 })

    // Detail page should show property name
    await expect(page.getByRole('heading', { name: testProperty.name })).toBeVisible()
  })
})
