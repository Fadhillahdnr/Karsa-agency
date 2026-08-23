import { expect, test } from '@playwright/test'
import { gotoReady } from './utils'

test.describe('Start a Project inquiry form', () => {
  test('shows inline validation errors for missing required fields', async ({ page }) => {
    await gotoReady(page, '/start-a-project')

    await page.getByRole('button', { name: 'Send Inquiry' }).click()

    await expect(page.getByText('Please enter your name')).toBeVisible()
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible()
    await expect(page.getByText('Please select a service.')).toBeVisible()
    await expect(page.getByText('Please describe your project')).toBeVisible()
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

    await page.getByLabel('Name', { exact: false }).fill('Jane Doe')
    await page.getByLabel('Email', { exact: false }).fill('jane@example.com')
    await page.getByLabel('Service', { exact: false }).selectOption('website')
    await page
      .getByLabel('Project Description', { exact: false })
      .fill('We need a new company profile website with a contact form and a blog section.')

    await page.getByRole('button', { name: 'Send Inquiry' }).click()

    await expect(page.getByText('KRS-TEST1234')).toBeVisible()
  })

  test('preserves form data and shows an error banner on server failure', async ({ page }) => {
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

    await page.getByLabel('Name', { exact: false }).fill('Jane Doe')
    await page.getByLabel('Email', { exact: false }).fill('jane@example.com')
    await page.getByLabel('Service', { exact: false }).selectOption('website')
    await page
      .getByLabel('Project Description', { exact: false })
      .fill('We need a new company profile website with a contact form and a blog section.')

    await page.getByRole('button', { name: 'Send Inquiry' }).click()

    await expect(page.getByRole('alert')).toContainText('couldn\'t save your inquiry')
    await expect(page.getByLabel('Name', { exact: false })).toHaveValue('Jane Doe')
    await expect(page.getByLabel('Email', { exact: false })).toHaveValue('jane@example.com')
  })
})
