export type CurrencyType = 'USD' | 'IQD';

export const USD_TO_IQD_RATE = 1500; // 1 USD = 1,500 IQD standard market rate

/**
 * Formats a USD amount to either USD ($) or IQD (Iraqi Dinar) string
 * @param amountUsd Numeric amount in USD
 * @param currency 'USD' or 'IQD'
 * @param compact Whether to use compact notation (e.g. $12.5k or 18.7M IQD)
 */
export function formatCurrency(
  amountUsd: number,
  currency: CurrencyType | string = 'USD',
  compact: boolean = false
): string {
  if (isNaN(amountUsd) || amountUsd === null || amountUsd === undefined) {
    return currency === 'USD' ? '$0' : '0 IQD';
  }

  if (currency === 'IQD') {
    const iqdAmount = Math.round(amountUsd * USD_TO_IQD_RATE);
    if (compact) {
      if (iqdAmount >= 1_000_000) {
        return `${(iqdAmount / 1_000_000).toFixed(1)}M IQD`;
      }
      if (iqdAmount >= 1_000) {
        return `${(iqdAmount / 1_000).toFixed(0)}k IQD`;
      }
      return `${iqdAmount.toLocaleString()} IQD`;
    }
    return `${iqdAmount.toLocaleString()} IQD`;
  }

  // USD
  if (compact) {
    if (amountUsd >= 1_000_000) {
      return `$${(amountUsd / 1_000_000).toFixed(1)}M`;
    }
    if (amountUsd >= 1_000) {
      return `$${(amountUsd / 1_000).toFixed(1)}k`;
    }
    return `$${Math.round(amountUsd).toLocaleString()}`;
  }

  return `$${Math.round(amountUsd).toLocaleString()}`;
}

/**
 * Converts an amount in USD to IQD number
 */
export function convertUsdToIqd(amountUsd: number): number {
  return Math.round(amountUsd * USD_TO_IQD_RATE);
}
