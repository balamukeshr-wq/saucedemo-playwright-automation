import { expect, type Locator, type Page } from '@playwright/test';
import { parsePrice } from '../utils/price';

/** Values of the product sort dropdown: A-Z, Z-A, price low-high, price high-low. */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
    readonly logo: Locator;
    readonly title: Locator;
    readonly items: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly cartBadge: Locator;
    readonly sortDropdown: Locator;
    private readonly cartLink: Locator;
    private readonly menuButton: Locator;
    private readonly logoutLink: Locator;

    constructor(private readonly page: Page) {
        this.logo = page.getByText('Swag Labs', { exact: true });
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
        this.itemNames = page.getByTestId('inventory-item-name');
        this.itemPrices = page.getByTestId('inventory-item-price');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.sortDropdown = page.getByTestId('product-sort-container');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutLink = page.getByTestId('logout-sidebar-link');;
    }

    /** Waits until the inventory page is showing. */
    async expectLoaded(timeout = 5_000): Promise<void> {
        await expect(this.page).toHaveURL(/inventory\.html/, { timeout });
        await expect(this.title).toHaveText('Products', { timeout });
    }

    /** The "Add to cart" / "Remove" button inside one product card. */
    private productButton(productName: string, label: 'Add to cart' | 'Remove'): Locator {
        return this.items.filter({ hasText: productName }).getByRole('button', { name: label });
    }

    async addToCart(productName: string): Promise<void> {
        await this.productButton(productName, 'Add to cart').click();
    }

    async removeFromCart(productName: string): Promise<void> {
        await this.productButton(productName, 'Remove').click();
    }

    async addFirstItemToCart(): Promise<void> {
        await this.items.first().getByRole('button', { name: 'Add to cart' }).click();
    }

    async sortBy(option: SortOption): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }

    async getItemNames(): Promise<string[]> {
        return this.itemNames.allTextContents();
    }

    async getItemPrices(): Promise<number[]> {
        const prices = await this.itemPrices.allTextContents();
        return prices.map(parsePrice);
    }

    async getItemPrice(productName: string): Promise<number> {
        const text = await this.items
            .filter({ hasText: productName })
            .getByTestId('inventory-item-price')
            .textContent();
        return parsePrice(text);
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.title).toHaveText('Your Cart');
    }

    async logout(): Promise<void> {
        await this.menuButton.click();
        await expect(this.logoutLink).toBeVisible();
        await this.logoutLink.click();
    }
}
