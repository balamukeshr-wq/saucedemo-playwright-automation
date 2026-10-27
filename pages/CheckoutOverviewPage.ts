import { type Locator, type Page } from '@playwright/test';
import { parsePrice } from '../utils/price';

export class CheckoutOverviewPage {
    readonly itemNames: Locator;
    private readonly subtotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly totalLabel: Locator;
    private readonly finishButton: Locator;

    constructor(private readonly page: Page) {
        this.itemNames = page.getByTestId('inventory-item-name');
        this.subtotalLabel = page.getByTestId('subtotal-label');
        this.taxLabel = page.getByTestId('tax-label');
        this.totalLabel = page.getByTestId('total-label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
    }

    /** "Item total: $39.98" -> 39.98 */
    async getItemTotal(): Promise<number> {
        return parsePrice(await this.subtotalLabel.textContent());
    }

    async getTax(): Promise<number> {
        return parsePrice(await this.taxLabel.textContent());
    }

    async getTotal(): Promise<number> {
        return parsePrice(await this.totalLabel.textContent());
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }
}
