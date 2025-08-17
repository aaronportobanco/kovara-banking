import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { AccountTypes, CategoryCount, Transaction } from "../../types";

/**
 * Combines class names using clsx and merges Tailwind classes.
 *
 * @param {...ClassValue[]} inputs - List of class values to combine.
 * @returns {string} Merged class string.
 *
 * @example
 * cn("bg-red-500", "text-white", { hidden: false });
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into various string representations for display.
 *
 * @param {Date} dateString - The date to format.
 * @returns {Object} Object containing formatted date/time strings.
 * @returns {string} return.dateTime - Full date and time (e.g., "Mon, Oct 25, 8:30 AM").
 * @returns {string} return.dateDay - Date with weekday and year (e.g., "Mon, 2023-10-25").
 * @returns {string} return.dateOnly - Date only (e.g., "Oct 25, 2023").
 * @returns {string} return.timeOnly - Time only (e.g., "8:30 AM").
 *
 * @example
 * formatDateTime(new Date());
 */
export const formatDateTime = (
  dateString: Date,
): {
  dateTime: string;
  dateDay: string;
  dateOnly: string;
  timeOnly: string;
} => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString("en-US", dateTimeOptions);

  const formattedDateDay: string = new Date(dateString).toLocaleString("en-US", dateDayOptions);

  const formattedDate: string = new Date(dateString).toLocaleString("en-US", dateOptions);

  const formattedTime: string = new Date(dateString).toLocaleString("en-US", timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/**
 * Formats a number as a USD currency string.
 *
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string.
 *
 * @example
 * formatAmount(1234.56); // "$1,234.56"
 */
export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

/**
 * Deep clones a value using JSON serialization.
 *
 * @param {unknown} value - The value to clone.
 * @returns {any} Cloned value.
 *
 * @example
 * parseStringify({ a: 1 }); // { a: 1 }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStringify = (value: unknown): any => JSON.parse(JSON.stringify(value));

/**
 * Removes special characters from a string, leaving only alphanumeric and spaces.
 *
 * @param {string | undefined | null} value - The string to sanitize.
 * @returns {string} Sanitized string.
 *
 * @example
 * removeSpecialCharacters("Hello!@#"); // "Hello"
 */
export const removeSpecialCharacters = (value: string | undefined | null): string => {
  if (!value) return "";
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

/**
 * Updates a URL query string with a new key-value pair.
 *
 * @param {UrlQueryParams} { params, key, value } - Query params object.
 * @returns {string} Updated URL string.
 *
 * @example
 * formUrlQuery({ params: "?a=1", key: "b", value: "2" });
 */
export function formUrlQuery({ params, key, value }: UrlQueryParams): string {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

/**
 * Returns Tailwind color classes based on account type.
 *
 * @param {AccountTypes} type - The account type ("depository", "credit", etc.).
 * @returns {Object} Object with Tailwind class names.
 *
 * @example
 * getAccountTypeColors("depository");
 */
export function getAccountTypeColors(type: AccountTypes): {
  bg: string;
  lightBg: string;
  title: string;
  subText: string;
} {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

/**
 * Counts occurrences of each transaction category.
 *
 * @param {Transaction[]} transactions - Array of transactions.
 * @returns {CategoryCount[]} Array of category count objects.
 *
 * @example
 * countTransactionCategories([{ category: "Food" }, { category: "Food" }]);
 */
export function countTransactionCategories(transactions: Transaction[]): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  if (transactions && transactions.length > 0) {
    transactions.forEach(transaction => {
      // Extract the category from the transaction
      const category = transaction.category || "Other";

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });
  }

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(category => ({
    name: category,
    count: categoryCounts[category],
    totalCount,
  }));

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

/**
 * Extracts the customer ID from a URL string.
 *
 * @param {string} url - The URL to parse.
 * @returns {string} Customer ID.
 *
 * @example
 * extractCustomerIdFromUrl("/customers/12345"); // "12345"
 */
export function extractCustomerIdFromUrl(url: string): string {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

/**
 * Encodes an ID string using base64.
 *
 * @param {string} id - The ID to encode.
 * @returns {string} Encoded ID.
 *
 * @example
 * encryptId("abc123");
 */
export function encryptId(id: string): string {
  return btoa(id);
}

/**
 * Decodes a base64-encoded ID string.
 *
 * @param {string} id - The encoded ID.
 * @returns {string} Decoded ID.
 *
 * @example
 * decryptId("YWJjMTIz"); // "abc123"
 */
export function decryptId(id: string): string {
  return atob(id);
}

/**
 * Determines the transaction status based on its date.
 *
 * @param {Date} date - The transaction date.
 * @returns {string} "processing" if within last 2 days, otherwise "success".
 *
 * @example
 * getTransactionStatus(new Date());
 */
export const getTransactionStatus = (date: Date): string => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "processing" : "success";
};

/**
 * Gets the current month's date range for filtering transactions.
 *
 * This utility function calculates the start and end dates for the current month,
 * which is useful for filtering transactions within the current billing period.
 * The start date is set to the first day of the month at midnight (00:00:00),
 * and the end date is set to the last day of the month at the end of day (23:59:59).
 *
 * @returns {Object} Object containing formatted start and end dates for the current month
 * @returns {string} return.startDate - ISO string for the first day of current month (YYYY-MM-01T00:00:00.000Z)
 * @returns {string} return.endDate - ISO string for the last day of current month (YYYY-MM-DDT23:59:59.999Z)
 * @returns {string} return.month - Localized month name (e.g., "January", "February")
 * @returns {number} return.year - Current year as a number
 *
 * @example
 * ```typescript
 * const currentMonth = getCurrentMonthDateRange();
 * console.log(`Filtering transactions from ${currentMonth.startDate} to ${currentMonth.endDate}`);
 * // Output for August 2025: "Filtering transactions from 2025-08-01T00:00:00.000Z to 2025-08-31T23:59:59.999Z"
 * ```
 */
export function getCurrentMonthDateRange(): {
  startDate: string;
  endDate: string;
  month: string;
  year: number;
} {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // First day of current month at midnight
  const startDate = new Date(year, month, 1, 0, 0, 0, 0);

  // Last day of current month at end of day
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    month: now.toLocaleString("en-US", { month: "long" }),
    year: year,
  };
}

/**
 * Determines if a transaction date falls within the current month.
 *
 * This function checks whether a given transaction date (either as a string or Date object)
 * falls within the current calendar month boundaries. It's useful for filtering
 * transactions to calculate monthly financial summaries.
 *
 * @param {string | Date} transactionDate - The transaction date to check (ISO string or Date object)
 * @returns {boolean} True if the transaction occurred in the current month, false otherwise
 *
 * @example
 * ```typescript
 * const august2025Transaction = "2025-08-15T10:30:00.000Z";
 * const july2025Transaction = "2025-07-30T14:20:00.000Z";
 *
 * console.log(isTransactionInCurrentMonth(august2025Transaction)); // true (if current month is August 2025)
 * console.log(isTransactionInCurrentMonth(july2025Transaction));   // false (if current month is August 2025)
 * ```
 */
export function isTransactionInCurrentMonth(transactionDate: string | Date): boolean {
  const { startDate, endDate } = getCurrentMonthDateRange();
  const txDate = new Date(transactionDate);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return txDate >= start && txDate <= end;
}
