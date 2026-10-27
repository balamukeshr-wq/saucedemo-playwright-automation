import { type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
    readonly confirmationHeading: Locator;
    private readonly backHomeButton: Locator;

    constructor(private readonly page: Page) {
        this.confirmationHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
        this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    }

    async backToProducts(): Promise<void> {
        await this.backHomeButton.click();
    }
}
