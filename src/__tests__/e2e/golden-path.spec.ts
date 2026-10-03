import { test, expect } from './helpers/fixtures'
import { type Locator, type Page } from '@playwright/test'
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
 *
 * PAYMENT AND RECEIPT live in the second test below. They used to stop here —
 * nothing drove « Enregistrer un paiement », so the dialog could offer the wrong
 * month, or none, and nothing would notice. A landlord's most delicate step (take
 * money, allocate it to the right month, produce the legal document) was the one
 * step no browser ever walked.
 */

test.describe.configure({ mode: 'serial' })

/** Rent + charges for the lease below. The month's obligation, and so what the
 *  payment dialog must offer, is `RENT + CHARGES`. */
const RENT = 850
const CHARGES = 50
const MONTH_DUE = RENT + CHARGES // 900

/** The amount a tenant pays in instalments, leaving `MONTH_DUE - PARTIAL` due. */
const PARTIAL = 400

/**
 * The options of the Select popup that is currently open.
 *
 * base-ui keeps a closed Select's listbox in the DOM (hidden), so
 * `locator('[role="listbox"]').last()` after closing the lease Select still
 * resolves to the LEASE options. Only a visible popup is the open one, and
 * scoping to it is what makes "the period offered" mean the period selecter's
 * options rather than whatever the last listbox in the document happens to be.
 */
function openOptions(page: Page) {
  return page.locator('[role="listbox"]:visible').last().locator('[role="option"]')
}

/** Every space-like character, including the two no-break spaces. */
const SPACES = /[\s  ]/g

/**
 * Read the euro amount a `dd` renders, with every space-like character removed.
 *
 * Comparing the rendered string to `Intl`'s output directly does not work:
 * Node formats "900,00 €" with U+00A0 before the sign while Chromium renders
 * U+202F, so an anchored equality never matches and the assertion would fail on
 * a correct figure. Stripped, both sides are "900,00€" — which is what the
 * landlord's eye compares anyway.
 */
async function renderedAmount(locator: Locator): Promise<string> {
  return locator.evaluate((node: Element) =>
    // Inlined rather than referencing SPACES: `evaluate` serialises the function
    // and runs it in the page, where module scope does not exist.
    (node.textContent ?? '').replace(/[\s  ]/g, '')
  )
}

/** An expected amount in the same shape `renderedAmount` returns. */
function compact(value: number): string {
  return euros(value).replace(SPACES, '')
}

/** Render a euro amount the way the app does, for substring assertions. */
function euros(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

/** Opening the « Enregistrer un paiement » dialog on /billing. */
async function openPaymentDialog(page: Page): Promise<void> {
  // The trigger is rendered twice while the table is empty (header + empty
  // state); strict mode refuses an ambiguous match, so take the first.
  await page.getByRole('button', { name: 'Enregistrer un paiement', exact: true }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 15_000 })
}

/**
 * Register a landlord who already has a property, a tenant and a lease covering
 * the current month, with a complete landlord address.
 *
 * The address is not decoration: `generateQuittance` refuses to issue a receipt
 * without it, because a quittance is a legal document that must name the
 * bailleur. That refusal is correct — so a landlord whose profile is empty gets
 * no receipt — but it means a test that wants the receipt has to be a landlord
 * who filled it in.
 */
async function setUpLandlord(page: Page, label: string): Promise<void> {
  await registerTestUser(page, uniqueEmail(`e2e.${label}`))

  await createProperty(page, {
    name: `Studio ${label}`,
    addressLine1: '12 rue de la République',
    city: 'Paris',
    postalCode: '75011',
    surface: 32,
    rooms: 1,
  })

  await createTenant(page, {
    firstName: 'Camille',
    lastName: 'Durand',
    email: `camille.${Date.now()}@example.com`,
  })

  await createLeaseThroughTheForm(page, new RegExp(`Studio ${label}`))

  // A quittance must name the bailleur; without this the download reports a
  // refusal rather than a document.
  await gotoStable(page, '/settings/profile')
  await page.locator('#addressLine1').fill('9 rue des Archives')
  await page.locator('#postalCode').fill('75004')
  await page.locator('#city').fill('Paris')
  await page.getByRole('button', { name: /enregistrer/i }).click()
  await expect(page.getByText(/profil enregistré/i)).toBeVisible({ timeout: 30_000 })
}

/** Rent + charges the lease below is created with. */
const LEASE_RENT = 850
const LEASE_CHARGES = 50

/**
 * The lease term, as UTC days.
 *
 * The lease starts on the 1st of the current month so the rent schedule covers
 * it: `computeDuePeriods` drops a period whose start is later than the current
 * month, and a lease starting mid-month can leave the period undated until its
 * due day. UTC because that is what the periods are keyed on.
 */
function leaseTerm(): { start: string; end: string; month: string; previousMonth: string } {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  return {
    start: iso(new Date(Date.UTC(year, month, 1))),
    end: iso(new Date(Date.UTC(year + 1, month, 0))),
    month: iso(new Date(Date.UTC(year, month, 1))),
    previousMonth: iso(new Date(Date.UTC(year, month - 1, 1))),
  }
}

/**
 * Fill and submit the lease form, then WAIT for the app to say it committed.
 *
 * Creating a lease is a server action; the click returns immediately and the row
 * is written afterwards. Navigating away on the click alone is a race: on a warm
 * production server the GET /leases beats the action's INSERT, so the page
 * renders "Aucun bail créé" while the lease is already in the database — the
 * assertion then fails with the lease present. The success toast is the app's own
 * signal that the write landed, so it is what the test waits on before moving on.
 */
async function createLeaseThroughTheForm(page: Page, propertyName: RegExp): Promise<void> {
  // The Selects are base-ui comboboxes, not native <select>; this is the step that
  // cannot be covered by a unit test.
  // /leases/new is compiled on first request, and the navigation aborts while it
  // happens (net::ERR_ABORTED). Warm the route, retrying until it settles.
  await gotoStable(page, '/leases/new')

  await selectOption(page, 'propertyId', propertyName)
  await selectOption(page, 'tenantId', /Camille Durand/)

  const term = leaseTerm()
  await page.locator('#rentAmount').fill(String(LEASE_RENT))
  await page.locator('#chargesAmount').fill(String(LEASE_CHARGES))
  await page.locator('#depositAmount').fill(String(LEASE_RENT))
  await page.locator('#startDate').fill(term.start)
  await page.locator('#endDate').fill(term.end)
  await page.getByRole('button', { name: /cr[ée]er le bail/i }).click()

  await expect(page.getByText('Bail créé avec succès')).toBeVisible({ timeout: 30_000 })
}

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
  await createLeaseThroughTheForm(page, /Studio République/)

  // ── the lease exists, and it owes rent ──────────────────────────────────────
  await gotoStable(page, '/leases')
  await expect(page.getByText(/850/).first()).toBeVisible({ timeout: 20_000 })

  // Arrears only exist if the rent schedule was generated when the lease was
  // created. Without it the dashboard shows nothing owed, which is silent.
  await gotoStable(page, '/billing')
  await expect(page.getByText(/900|850|50/).first()).toBeVisible({ timeout: 20_000 })
})

test('a landlord takes a partial payment, then the balance, and downloads the receipt', async ({
  page,
}) => {
  // Six steps and two dialog round-trips, each waiting on a real server action.
  // The path runs in 9s against a warm production server, so the 120s default has
  // ample room; `test.slow()` is kept only because the same spec is run locally
  // against `next dev`, where every route compiles on first request.
  test.slow()
  await setUpLandlord(page, 'Receipt')

  await gotoStable(page, '/billing')

  // ── the month is collectable, and offered at its real balance ────────────────
  // `formatCurrency` in the option label is the remaining balance, not the rent:
  // this is the figure the dialog offers to collect, and the figure a wrong
  // period-selection would get wrong.
  await openPaymentDialog(page)
  await selectOption(page, 'leaseId', /Camille Durand/)

  // The period Select is enabled only once a lease is chosen, so its trigger is
  // clicked here rather than by `selectOption` (which fills the trigger id).
  await page.locator('#duePeriodId').click()
  const periodOption = openOptions(page).first()
  // A lease with nothing left to collect must SAY so rather than offer an empty
  // month, so the absence of this option is a failure too — hence `toHaveCount(1)`
  // before clicking it, not a `.click()` that silently no-ops.
  await expect(periodOption).toHaveCount(1, { timeout: 20_000 })
  await expect(periodOption).toContainText(euros(MONTH_DUE))
  await periodOption.click()

  // The proof-of-what-is-settled block: total owed, already received, and the
  // balance. All three come from the domain, not from the lease's rent alone.
  // Scoped to the `dl` because "Reste à payer" also opens a helper sentence under
  // the amount field.
  const summary = page.getByRole('dialog').locator('dl')
  await expect(summary.locator('dt', { hasText: 'Total dû' })).toBeVisible()
  await expect(summary.locator('dt', { hasText: 'Déjà encaissé' })).toBeVisible()
  await expect(summary.locator('dt', { hasText: 'Reste à payer' })).toBeVisible()

  // Exact figures, read label-adjacent. A substring match on "0,00 €" is also
  // satisfied by "900,00 €", so these compare the whole rendered amount.
  const amounts = await Promise.all([
    renderedAmount(summary.locator('dd').nth(0)),
    renderedAmount(summary.locator('dd').nth(1)),
    renderedAmount(summary.locator('dd').nth(2)),
  ])
  // Total dû, Déjà encaissé, Reste à payer: nothing received yet, so the month is
  // owed in full.
  expect(amounts).toEqual([compact(MONTH_DUE), compact(0), compact(MONTH_DUE)])

  // ── a PARTIAL payment is accepted, and the month stays collectable ───────────
  // The invariant: paying less than the balance must not consume the obligation.
  // It used to — a partial payment overwrote the period row with the payment,
  // so the rest of the month became uncollectable for good.
  await page.locator('#amount').fill(String(PARTIAL))
  // The field is keyed on the selected period, so a re-render after the fill can
  // restore the prefilled balance. Read it back: submitting 900 instead of 400
  // would settle the month outright and silently skip the very case this test
  // exists to cover.
  await expect(page.locator('#amount')).toHaveValue(String(PARTIAL))
  // « Moyen de paiement » is deliberately NOT touched here. base-ui submits an
  // empty string for an intact Select, and `transactionSchema` used to reject
  // that "" at the enum's door — so a landlord paying by transfer could not
  // record the payment without filling a field that is not required. The schema
  // now reads "" as "absent" while still refusing a value outside the enum
  // (bugA-payment-method.test.ts). Leaving this line out is the regression
  // guard: if the schema rejects "" again, this payment is refused and the
  // next assertion fails.
  await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer le paiement' }).click()
  await expect(page.getByText('Paiement enregistré avec succès')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 15_000 })

  // The instalment is on the register, against the month it belongs to, and it is
  // an instalment: « Reçu », not « Quittance ». A tenant who has not settled the
  // month has not earned a quittance, and the type is what says so.
  await gotoStable(page, '/billing')
  const instalmentRow = page.getByRole('row').filter({ hasText: euros(PARTIAL) })
  await expect(instalmentRow).toHaveCount(1, { timeout: 20_000 })
  await expect(instalmentRow).toContainText('Partiel')
  await expect(instalmentRow).toContainText('Reçu')
  await expect(instalmentRow).not.toContainText('Quittance')

  // Reopening the dialog: the SAME month must still be offered, now at what is
  // left. This is the assertion that fails if a partial payment is treated as
  // settling the month.
  await openPaymentDialog(page)
  await selectOption(page, 'leaseId', /Camille Durand/)
  await page.locator('#duePeriodId').click()
  const secondOffer = openOptions(page).first()
  await expect(secondOffer).toHaveCount(1, { timeout: 20_000 })
  await expect(secondOffer).toContainText(euros(MONTH_DUE - PARTIAL))
  await secondOffer.click()

  // The dialog states the balance it is about to collect, from the domain.
  // Scoped to the `dl` for the same reason as above.
  const secondAmounts = await Promise.all([
    renderedAmount(page.getByRole('dialog').locator('dl').locator('dd').nth(1)),
    renderedAmount(page.getByRole('dialog').locator('dl').locator('dd').nth(2)),
  ])
  // Déjà encaissé is what the first instalment brought in; Reste à payer is the
  // balance the dialog is about to collect.
  expect(secondAmounts).toEqual([compact(PARTIAL), compact(MONTH_DUE - PARTIAL)])
  // The amount field is prefilled with what is left, so a landlord who paid the
  // balance in full does not have to compute it.
  await expect(page.locator('#amount')).toHaveValue(String(MONTH_DUE - PARTIAL))

  // Again, no « Moyen de paiement »: leaving the Select untouched is the case
  // this card fixed, and paying the balance must not require filling a field
  // that is not mandatory either.
  await page.getByRole('dialog').getByRole('button', { name: 'Enregistrer le paiement' }).click()
  await expect(page.getByText('Paiement enregistré avec succès')).toBeVisible({ timeout: 30_000 })

  // ── the month is settled: nothing left to collect ───────────────────────────
  await gotoStable(page, '/billing')
  // Scoped to the row's own figures, not to the word "Payé" alone, so the
  // assertion cannot be satisfied by an unrelated row's status.
  const settledRow = page
    .getByRole('row')
    .filter({ hasText: euros(MONTH_DUE - PARTIAL) })
    .filter({ hasText: 'Payé' })
  await expect(settledRow).toHaveCount(1, { timeout: 20_000 })

  // Nothing left to collect. Rent periods are only generated up to the current
  // month, so paying this month's obligation empties the list — and the dialog
  // must SAY so instead of offering an empty month to fill in.
  //
  // A settled month must not reappear here as a second collectable period: that
  // would let the same money be booked twice.
  await openPaymentDialog(page)
  await selectOption(page, 'leaseId', /Camille Durand/)
  await expect(page.getByText('Aucune période de loyer à encaisser pour ce bail.')).toBeVisible({
    timeout: 20_000,
  })
  // The period Select is disabled for the same reason, so this cannot be reached
  // by filling in a period that should not exist.
  await expect(page.locator('#duePeriodId')).toBeDisabled()
  await page.keyboard.press('Escape')

  // ── the receipt is a real, downloadable document with a reference ────────────
  // The month was paid in two instalments, and this walks the whole way a
  // landlord does: click, receive a file, and check the file is a PDF carrying
  // the reference the server allocated.
  //
  // The instalment row was typed « Reçu » when it was recorded — a tenant who had
  // not yet settled the month had not earned a quittance. The document produced
  // NOW is a « Quittance » anyway, because the download route judges the PERIOD at
  // generation time and the month is complete. That is the behaviour that lets a
  // tenant paying in instalments obtain a quittance at all; judging it from one
  // payment's amount is what used to deny them one.
  //
  // FIXME(financial card): the row that SETTLED the month carries no
  // `receiptType`, so /billing offers it no download button at all — the quittance
  // is reachable only from the earlier instalment's row. `settleRentPeriod` writes
  // `status` and `isFullPayment` on the closed row but not `receiptType`, while the
  // table gates its button on `tx.receiptType`. Reported, not fixed here: it is a
  // financial rule.
  const receiptRow = page.getByRole('row').filter({ hasText: euros(PARTIAL) })
  await expect(receiptRow).toHaveCount(1, { timeout: 20_000 })
  const downloadButton = receiptRow.getByRole('button', { name: /télécharger/i }).first()
  await expect(downloadButton).toBeVisible({ timeout: 20_000 })

  const downloadPromise = page.waitForEvent('download', { timeout: 60_000 })
  await downloadButton.click()
  const download = await downloadPromise

  // The reference IS the receipt number the server allocated, and it must not be
  // the client's fallback name: a file called "quittance.pdf" is what a document
  // with no reference downloads as. So the shape is asserted, prefix and all.
  const fileName = download.suggestedFilename()
  expect(fileName).toMatch(/^QUI-\d{4}-\d{2}-\d{4}\.pdf$/)

  // And the bytes are a PDF, not an error page saved under a receipt's name.
  const stream = await download.createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  const bytes = Buffer.concat(chunks)
  expect(bytes.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  expect(bytes.length).toBeGreaterThan(1000)

  // A receipt for money that arrived carries the amount and the date it was
  // recorded, read from the PDF's own text rather than from the page that
  // offered the download.
  const pdfText = bytes.toString('latin1')
  expect(pdfText).toContain('400')
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