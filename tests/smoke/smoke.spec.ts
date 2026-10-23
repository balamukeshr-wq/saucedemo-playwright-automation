
import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../../data/users';

test(`Standard user logs in and lands on inventory @smoke`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('inventory-container')).toBeVisible();
});