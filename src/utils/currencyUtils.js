/**
 * Torchbearer AI — Currency & Compensation Formatter
 * 
 * Enforces Indian Rupee (INR / ₹) as the primary currency for Indian opportunities,
 * uses proper Indian number formatting (Lakhs/Crores), and provides smart conversions
 * for international compensation.
 */

const USD_TO_INR_RATE = 83.5;
const EUR_TO_INR_RATE = 90.0;
const GBP_TO_INR_RATE = 106.0;

/**
 * Formats a number according to the Indian numbering system (e.g. 1,00,000)
 */
export function formatIndianNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  const numStr = Math.round(Number(num)).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
}

/**
 * Cleans and formats stipend / salary strings into professional, INR-standardized representations
 */
export function formatCompensation({
  stipend,
  salary,
  prize,
  currency = 'INR',
  country = 'India',
  amount = null
}) {
  const rawValue = stipend || salary || prize;
  if (!rawValue && !amount) return null;

  const rawStr = String(rawValue || amount || '').trim();
  if (!rawStr || rawStr.toLowerCase() === 'unpaid' || rawStr.toLowerCase() === 'none') {
    return 'Unpaid / Experience';
  }

  // If already formatted with ₹ and Lakhs/Per month, preserve and clean
  if (rawStr.startsWith('₹') || rawStr.includes('₹')) {
    return rawStr;
  }

  // Handle USD formatting with INR conversion
  const usdMatch = rawStr.match(/(?:\$|USD\s*)([0-9,]+(?:\.[0-9]+)?)/i);
  if (usdMatch) {
    const usdVal = parseFloat(usdMatch[1].replace(/,/g, ''));
    if (!isNaN(usdVal) && usdVal > 0) {
      const inrVal = Math.round(usdVal * USD_TO_INR_RATE);
      const isPerMonth = /month|mo|pm/i.test(rawStr);
      const isPerHour = /hour|hr/i.test(rawStr);
      const isTotal = /total|prize|grant/i.test(rawStr);

      const period = isPerMonth ? '/mo' : isPerHour ? '/hr' : isTotal ? ' Total' : '';
      return '$' + formatIndianNumber(usdVal) + period + ' (≈ ₹' + formatIndianNumber(inrVal) + period + ')';
    }
  }

  // Handle EUR formatting
  const eurMatch = rawStr.match(/(?:€|EUR\s*)([0-9,]+(?:\.[0-9]+)?)/i);
  if (eurMatch) {
    const eurVal = parseFloat(eurMatch[1].replace(/,/g, ''));
    if (!isNaN(eurVal) && eurVal > 0) {
      const inrVal = Math.round(eurVal * EUR_TO_INR_RATE);
      return '€' + formatIndianNumber(eurVal) + ' (≈ ₹' + formatIndianNumber(inrVal) + ')';
    }
  }

  // Handle CHF (e.g. CERN)
  const chfMatch = rawStr.match(/(?:CHF\s*)([0-9,]+(?:\.[0-9]+)?)/i);
  if (chfMatch) {
    const chfVal = parseFloat(chfMatch[1].replace(/,/g, ''));
    if (!isNaN(chfVal) && chfVal > 0) {
      const inrVal = Math.round(chfVal * 95);
      return chfVal + ' CHF (≈ ₹' + formatIndianNumber(inrVal) + '/mo)';
    }
  }

  // If pure number in amount or rawStr
  const numericOnly = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
  if (!isNaN(numericOnly) && numericOnly > 0) {
    if (numericOnly >= 10000000) {
      const cr = (numericOnly / 10000000).toFixed(1).replace(/\.0$/, '');
      return '₹' + cr + ' Crore';
    }
    if (numericOnly >= 100000 && /lpa|annum|year/i.test(rawStr)) {
      const lpa = (numericOnly / 100000).toFixed(1).replace(/\.0$/, '');
      return '₹' + lpa + ' LPA';
    }
    if (numericOnly >= 1000) {
      const isMonth = /month|mo|pm/i.test(rawStr) || numericOnly < 200000;
      return '₹' + formatIndianNumber(numericOnly) + (isMonth ? '/month' : '');
    }
  }

  // Default fallback: Replace any stray '$' with '₹' if location is India
  if (country && country.toLowerCase() === 'india' && rawStr.includes('$')) {
    return rawStr.replace(/\$/g, '₹');
  }

  return rawStr;
}
