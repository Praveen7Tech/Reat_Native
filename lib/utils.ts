/**
 * Formats a number as currency with specific locale and currency code
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'INR')
 * @returns Formatted currency string with rupee symbol and 2 decimal places
 */
export const formatCurrency = (
  value: number,
  currency: string = "INR"
): string => {
  try {
    // Validate input
    if (typeof value !== "number" || isNaN(value)) {
      return "₹0.00";
    }

    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(value);
  } catch (error) {
    // Fallback formatting if Intl fails or unsupported currency
    console.warn(
      `Error formatting currency with code ${currency}. Using INR fallback.`,
      error
    );

    // Basic fallback: manual INR formatting
    const formatted = value.toFixed(2);
    return `₹${formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }
};

/**
 * Formats a number as INR currency specifically
 * @param value - The numeric value to format
 * @returns Formatted INR string with rupee symbol and 2 decimal places
 */
export const formatINR = (value: number): string => {
  return formatCurrency(value, "INR");
};
