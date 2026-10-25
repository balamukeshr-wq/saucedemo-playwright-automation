import { test, expect } from '@playwright/test';
import { users } from '../../data/users';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';


// Data-driven: one test is generated for every row below.
const invalidLogins = [
    {
        scenario: 'locked out user',
        username: users.lockedOut.username,
        password: users.lockedOut.password,
        expectedError: 'Sorry, this user has been locked out.',
    },
    {
        scenario: 'wrong password',
        username: users.standard.username,
        password: 'wrong_password',
        expectedError: 'Username and password do not match any user in this service',
    },
    {
        scenario: 'unknown username',
        username: 'no_such_user',
        password: users.standard.password,
        expectedError: 'Username and password do not match any user in this service',
    },
    {
        scenario: 'missing username',
        username: '',
        password: users.standard.password,
        expectedError: 'Username is required',
    },
    {
        scenario: 'missing password',
        username: users.standard.username,
        password: '',
        expectedError: 'Password is required',
    },

    {
        scenario: 'username with surrounding spaces',
        username: ` ${users.standard.username} `,
        password: users.standard.password,
        expectedError: 'Username and password do not match any user in this service',
    },
    {
        scenario: 'username is case sensitive',
        username: 'Standard_User',
        password: users.standard.password,
        expectedError: 'Username and password do not match any user in this service',
    },

];


for (const { scenario, username, password, expectedError } of invalidLogins) {
    test(`rejects login: ${scenario}`, { tag: '@regression' }, async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        await expect(loginPage.errorMessage).toContainText(expectedError);
        await expect(page).not.toHaveURL(/inventory\.html/);
    });
}

test('user can log out and returns to the login page', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();

    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
});

const specialUsers = [
    { scenario: 'problem user', user: users.problem },
    { scenario: 'performance glitch user', user: users.performanceGlitch },
];

for (const { scenario, user } of specialUsers) {
    test(`allows login: ${scenario}`, { tag: '@regression' }, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await loginPage.goto();
        await loginPage.login(user.username, user.password);

        await expect(page).toHaveURL(/inventory\.html/, { timeout: 15_000 });
        await inventoryPage.expectLoaded();
    });
}

test('error banner can be closed', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.errorCloseButton.click();
    await expect(loginPage.errorMessage).toBeHidden();
});

test('inventory page is blocked without login', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toContainText('You can only access');
});