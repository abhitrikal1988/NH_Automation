import { test as setup, expect } from '@playwright/test';

setup('authenticate user', async ({ page }) => {
 
    await page.goto(process.env.BASE_URL);
    await page.getByRole('button', { name: 'Agree', exact: true }).click();
    await page.getByRole('textbox', { name: 'someone@example.com' }).click();
    await page.getByRole('textbox', { name: 'someone@example.com' }).fill(process.env.ENR_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(2000);
    await page.locator('#i0118').fill(process.env.ENR_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('link', { name: ' HTA Medical Benefits (QA1)' }).click();
    await page.getByRole('link', { name: ' Enrollment 2.0' }).click();
    await page.context().storageState({ path: 'user.json' });
      
});