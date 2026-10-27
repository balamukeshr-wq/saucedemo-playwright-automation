import { test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage'
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../data/users';

type Fixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutInfoPage: CheckoutInfoPage;
    checkoutOverviewPage: CheckoutOverviewPage;
    checkoutCompletePage: CheckoutCompletePage;
    /** The inventory page, reached after logging in as the standard user. */
    loggedInInventoryPage: InventoryPage;
    /** Cart with the first item, already on the checkout info page. */
    checkoutReady: CheckoutInfoPage;
};


/**
 * Custom test object. Every page object is created for you, so specs never
 * need `new SomePage(page)`. Import `test` and `expect` from here, not from
 * '@playwright/test', in every spec.
 */
export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutInfoPage: async ({ page }, use) => {
        await use(new CheckoutInfoPage(page));
    },
    checkoutOverviewPage: async ({ page }, use) => {
        await use(new CheckoutOverviewPage(page));
    },
    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },
    loggedInInventoryPage: async ({ loginPage, inventoryPage }, use) => {
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        await inventoryPage.expectLoaded();
        await use(inventoryPage);
    },
    checkoutReady: async ({ loggedInInventoryPage, cartPage, checkoutInfoPage }, use) => {
        await loggedInInventoryPage.addFirstItemToCart();
        await loggedInInventoryPage.openCart();
        await cartPage.checkout();
        await use(checkoutInfoPage);
    },

});

export { expect } from '@playwright/test';
