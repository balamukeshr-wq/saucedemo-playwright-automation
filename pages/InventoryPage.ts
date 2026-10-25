import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly logo: Locator;
    readonly title: Locator;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;

    constructor(private readonly page: Page) {
        this.logo = page.getByText('Swag Labs', { exact: true });
        this.title = page.getByTestId('title');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutLink = page.getByRole('button', { name: 'Logout' });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/inventory\.html/);
        await expect(this.title).toHaveText('Products');
    }

    async logout(): Promise<void> {
        await this.menuButton.click();
        await this.logoutLink.click();
    }
}
