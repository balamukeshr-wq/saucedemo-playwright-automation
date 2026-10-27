import { test, expect } from '../fixtures/base';
import { products } from '../data/products';
import { generateCustomer } from '../utils/customer';

test.describe('Checkout', () => {
    test('user can buy the first item end to end', { tag: '@smoke' }, async ({
        page,
        loggedInInventoryPage: inventoryPage,
        cartPage,
        checkoutInfoPage,
        checkoutOverviewPage,
        checkoutCompletePage,
    }) => {
        // Add the first item and confirm the cart badge.
        await inventoryPage.addFirstItemToCart();
        await expect(inventoryPage.cartBadge).toHaveText('1');

        // Cart: the right item is there.
        await inventoryPage.openCart();
        await expect(cartPage.itemNames).toHaveText(products.backpack);
        await cartPage.checkout();

        // Customer information.
        await checkoutInfoPage.fillInformation(generateCustomer());
        await checkoutInfoPage.continue();

        // Overview: the same item, then finish.
        await expect(checkoutOverviewPage.itemNames).toHaveText(products.backpack);
        await checkoutOverviewPage.finish();

        // Confirmation.
        await expect(checkoutCompletePage.confirmationHeading).toBeVisible();
        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(inventoryPage.cartBadge).toBeHidden();
    });

    // Data-driven: each required field is left empty in turn.
    const missingFieldCases = [
        { field: 'first name', overrides: { firstName: '' }, expectedError: 'First Name is required' },
        { field: 'last name', overrides: { lastName: '' }, expectedError: 'Last Name is required' },
        { field: 'postal code', overrides: { postalCode: '' }, expectedError: 'Postal Code is required' },
    ];

    for (const { field, overrides, expectedError } of missingFieldCases) {
        test(`checkout form rejects a missing ${field}`, { tag: '@regression' }, async ({

            checkoutReady: checkoutInfoPage,
        }) => {

            await checkoutInfoPage.fillInformation(generateCustomer(overrides));
            await checkoutInfoPage.continue();

            await expect(checkoutInfoPage.errorMessage).toContainText(expectedError);
        });
    }

    test('order total equals item total plus tax', { tag: '@regression' }, async ({
        loggedInInventoryPage: inventoryPage,
        cartPage,
        checkoutInfoPage,
        checkoutOverviewPage,
    }) => {
        const backpackPrice = await inventoryPage.getItemPrice(products.backpack);
        const bikeLightPrice = await inventoryPage.getItemPrice(products.bikeLight);
        await inventoryPage.addToCart(products.backpack);
        await inventoryPage.addToCart(products.bikeLight);
        await inventoryPage.openCart();
        await cartPage.checkout();
        await checkoutInfoPage.fillInformation(generateCustomer());
        await checkoutInfoPage.continue();

        const itemTotal = await checkoutOverviewPage.getItemTotal();
        const tax = await checkoutOverviewPage.getTax();
        const total = await checkoutOverviewPage.getTotal();

        expect(itemTotal).toBeCloseTo(backpackPrice + bikeLightPrice, 2);
        expect(total).toBeCloseTo(itemTotal + tax, 2);
    });

    test('cancelling checkout returns to the cart', { tag: '@regression' }, async ({ page,
        cartPage,
        checkoutReady: checkoutInfoPage, }) => {
        await checkoutInfoPage.cancel();

        await expect(page).toHaveURL(/cart\.html/);
        await expect(cartPage.items).toHaveCount(1);
    });
});
