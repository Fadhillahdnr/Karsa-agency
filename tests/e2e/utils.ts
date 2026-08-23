import type { Page } from '@playwright/test'

/**
 * Navigates and waits for client-side hydration to finish before returning.
 * SSR renders full markup immediately, so a plain page.goto() can leave
 * Playwright clicking real-looking elements before Vue's listeners attach
 * (native form submits reload the page instead of running our handlers).
 */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await page.locator('[data-hydrated="true"]').waitFor({ state: 'attached' })
}
