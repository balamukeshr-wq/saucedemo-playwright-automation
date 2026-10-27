import { type Locator, type Page } from '@playwright/test';
import { type Customer } from '../utils/customer';

export class CheckoutInfoPage {
    readonly errorMessage: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly cancelButton: Locator;

    constructor(private readonly page: Page) {
        this.errorMessage = page.getByTestId('error');
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async fillInformation(customer: Customer): Promise<void> {
        await this.firstNameInput.fill(customer.firstName);
        await this.lastNameInput.fill(customer.lastName);
        await this.postalCodeInput.fill(customer.postalCode);
    }

    async continue(): Promise<void> {
        await this.continueButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }
}
