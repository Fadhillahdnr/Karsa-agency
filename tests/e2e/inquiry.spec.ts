import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

/** Walks steps 1-4 of the wizard with valid data, leaving the review step (5) active. */
async function fillThroughToReview(page: Page) {
  await page.getByRole('button', { name: 'Website', exact: true }).click()
  await page.getByRole('button', { name: 'Next' }).click()

  await page
    .getByLabel('Project Description', { exact: false })
    .fill('We need a new company profile website with a contact form and a blog section.')
  await page.getByRole('button', { name: 'Next' }).click()

  // Budget & timeline — both optional, skip straight through.
  await page.getByRole('button', { name: 'Next' }).click()

  await page.getByLabel('Name', { exact: false }).fill('Jane Doe')
  await page.getByLabel('Email', { exact: false }).fill('jane@example.com')
  await page.getByRole('button', { name: 'Next' }).click()
}

test.describe('Start a Project inquiry form', () => {
  test('blocks progression at each step until it is valid', async ({ page }) => {
    await gotoReady(page, '/start-a-project')

    await expect(page.getByText('Step 1 of 5')).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Please select a service.')).toBeVisible()

    await page.getByRole('button', { name: 'Website', exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 2 of 5')).toBeVisible()

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Please describe your project')).toBeVisible()

    await page
      .getByLabel('Project Description', { exact: false })
      .fill('We need a new company profile website with a contact form and a blog section.')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 3 of 5')).toBeVisible()

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 4 of 5')).toBeVisible()

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Please enter your name')).toBeVisible()
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible()

    await page.getByLabel('Name', { exact: false }).fill('Jane Doe')
    await page.getByLabel('Email', { exact: false }).fill('jane@example.com')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 5 of 5')).toBeVisible()

    await page.getByRole('button', { name: 'Send Inquiry' }).click()
    await expect(page.getByText('Please agree to the privacy policy')).toBeVisible()
  })

  test('submits successfully and shows a reference ID', async ({ page }) => {
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, referenceId: 'KRS-TEST1234' }),
      })
    })

    await gotoReady(page, '/start-a-project')
    await fillThroughToReview(page)

    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Send Inquiry' }).click()

    await expect(page.getByText('KRS-TEST1234')).toBeVisible()
  })

  test('preserves step data and shows an error banner on server failure', async ({ page }) => {
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          code: 'STORAGE_ERROR',
          message: 'We couldn\'t save your inquiry right now. Please try again shortly.',
        }),
      })
    })

    await gotoReady(page, '/start-a-project')
    await fillThroughToReview(page)

    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Send Inquiry' }).click()

    await expect(page.getByRole('alert')).toContainText('couldn\'t save your inquiry')

    // Step data survives the failed submit — jump back to "About you" via
    // the review step's Edit link and confirm the fields are still filled.
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByLabel('Name', { exact: false })).toHaveValue('Jane Doe')
    await expect(page.getByLabel('Email', { exact: false })).toHaveValue('jane@example.com')
  })
})
