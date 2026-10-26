import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../data/users';
import { products } from '../data/products';
import { CartPage } from '../pages/CartPage';

let inventoryPage: InventoryPage;
let cartPage: CartPage


test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await inventoryPage.expectLoaded();
});

test.describe('Cart', () => {
  test('lists every item that was added', { tag: '@smoke' }, async () => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.boltTShirt);
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(2);
    const names = await cartPage.getItemNames();
    expect(names.sort()).toEqual([products.backpack, products.boltTShirt].sort());
  });

  test('removing the only item empties the cart', { tag: '@regression' }, async () => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('continue shopping returns to the product list', { tag: '@regression' }, async () => {
    await inventoryPage.openCart();

    await cartPage.continueShopping();

    await inventoryPage.expectLoaded();
  });
});
