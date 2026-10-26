/** Converts display text such as "Item total: $29.99" or "$9.99" into a number. */
export function parsePrice(text: string | null): number {
  if (text === null) {
    throw new Error('Cannot parse a price from null text');
  }
  const value = Number(text.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(value)) {
    throw new Error(`Could not parse a price from "${text}"`);
  }
  return value;
}
