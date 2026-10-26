import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage, type SortOption } from '../pages/InventoryPage';
import { users } from '../data/users';
import { products } from '../data/products'

let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
});
test.describe('Inventory', () => {
    test('shows the full product catalogue', { tag: '@smoke' }, async () => {
        await expect(inventoryPage.items).toHaveCount(6);
    });

    // Data-driven: each sort option is checked against an order computed in the test.
    const sortCases: { option: SortOption; description: string }[] = [
        { option: 'az', description: 'name A to Z' },
        { option: 'za', description: 'name Z to A' },
        { option: 'lohi', description: 'price low to high' },
        { option: 'hilo', description: 'price high to low' },
    ];

    for (const { option, description } of sortCases) {
        test(`sorts products by ${description}`, { tag: '@regression' }, async () => {
            await inventoryPage.sortBy(option);

            if (option === 'az' || option === 'za') {
                const names = await inventoryPage.getItemNames();
                const expected = [...names].sort((a, b) => a.localeCompare(b));
                if (option === 'za') expected.reverse();
                expect(names).toEqual(expected);
            } else {
                const prices = await inventoryPage.getItemPrices();
                const expected = [...prices].sort((a, b) => a - b);
                if (option === 'hilo') expected.reverse();
                expect(prices).toEqual(expected);
            }
        });
    }

    test('cart badge follows items added and removed', { tag: '@regression' }, async () => {
        await expect(inventoryPage.cartBadge).toBeHidden();

        await inventoryPage.addToCart(products.backpack);
        await expect(inventoryPage.cartBadge).toHaveText('1');

        await inventoryPage.addToCart(products.bikeLight);
        await expect(inventoryPage.cartBadge).toHaveText('2');

        await inventoryPage.removeFromCart(products.backpack);
        await expect(inventoryPage.cartBadge).toHaveText('1');

        await inventoryPage.removeFromCart(products.bikeLight);
        await expect(inventoryPage.cartBadge).toBeHidden();
    });
});
