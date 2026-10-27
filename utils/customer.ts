import { faker } from '@faker-js/faker';

export interface Customer {
    firstName: string;
    lastName: string;
    postalCode: string;
}

/** Random customer. Pass overrides to force a value, e.g. { firstName: '' }. */
export function generateCustomer(overrides: Partial<Customer> = {}): Customer {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        postalCode: faker.location.zipCode(),
        ...overrides,
    };
}