import { test, expect } from '../fixtures/base';
import { products } from '../data/products';

test.describe('Cart', () => {
  test('lists every item that was added', { tag: '@smoke' }, async ({
    loggedInInventoryPage: inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.boltTShirt);
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(2);
    const names = await cartPage.getItemNames();
    expect(names.sort()).toEqual([products.backpack, products.boltTShirt].sort());
  });

  test('removing the only item empties the cart', { tag: '@regression' }, async ({
    loggedInInventoryPage: inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('continue shopping returns to the product list', { tag: '@regression' }, async ({
    loggedInInventoryPage: inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.openCart();

    await cartPage.continueShopping();

    await inventoryPage.expectLoaded();
  });
});
