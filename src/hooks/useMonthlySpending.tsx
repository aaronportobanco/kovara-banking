"use client";

import { useState, useEffect, useCallback } from "react";
import { getCurrentMonthFinancials } from "@/services/actions/transactions.actions";
import { CurrentMonthFinancials, UseMonthlySpendingProps, UseMonthlySpendingReturn } from "#/types";

/**
 * Custom hook to fetch and manage monthly spending data for the Kovara Banking application
 *
 * This hook serves as a data layer bridge between React components and the Appwrite backend,
 * providing real-time monthly financial information including income, expenses, and spending trends.
 * It integrates with Plaid transaction data through the transactions service layer.
 *
 * @param userId - The unique identifier for the authenticated user (required)
 * @param enabled - Flag to control automatic data fetching on mount (default: true)
 *
 * @returns {UseMonthlySpendingReturn} Object containing:
 *   - monthlyFinancials: Current month's financial data or null if not loaded
 *   - loading: Boolean indicating if a fetch operation is in progress
 *   - error: Error message string or null if no error occurred
 *   - refetch: Function to manually trigger data refresh
 *
 * @example
 * ```tsx
 * const { monthlyFinancials, loading, error, refetch } = useMonthlySpending({
 *   userId: user.id,
 *   enabled: true
 * });
 *
 * if (loading) return <Spinner />;
 * if (error) return <ErrorMessage message={error} />;
 * if (monthlyFinancials) {
 *   // Render financial dashboard with monthlyFinancials.totalSpent, etc.
 * }
 * ```
 */
export const useMonthlySpending = ({
  userId,
  enabled = true,
}: UseMonthlySpendingProps): UseMonthlySpendingReturn => {
  // State to store the current month's financial data from Appwrite/Plaid
  // Null indicates data hasn't been loaded yet or failed to load
  const [monthlyFinancials, setMonthlyFinancials] = useState<CurrentMonthFinancials | null>(null);

  // Loading state to manage UI feedback during API calls
  // Prevents multiple simultaneous requests and provides loading indicators
  const [loading, setLoading] = useState(false);

  // Error state for handling and displaying API or validation errors
  // String error messages are user-friendly and can be displayed directly in UI
  const [error, setError] = useState<string | null>(null);

  /**
   * Memoized function to fetch monthly financial data from the backend
   *
   * This function communicates with the transactions service layer which:
   * 1. Retrieves transaction data from Plaid
   * 2. Processes and aggregates monthly spending patterns
   * 3. Returns structured financial data for the current month
   *
   * Error handling follows the Kovara Banking pattern:
   * - Validates userId before making API calls
   * - Captures errors with Sentry integration (handled in service layer)
   * - Provides user-friendly error messages for UI display
   *
   * @returns Promise<void> - Updates component state with fetched data or error
   */
  const fetchFinancials = useCallback(async (): Promise<void> => {
    // Early validation to prevent unnecessary API calls
    if (!userId) {
      setError("User ID is required");
      return;
    }

    // Reset error state and set loading for UI feedback
    setLoading(true);
    setError(null);

    try {
      // Call to transactions service layer - integrates with Appwrite backend
      // and Plaid transaction data to compute monthly financial metrics
      const data = await getCurrentMonthFinancials({ userId });
      setMonthlyFinancials(data);
    } catch (err) {
      // Error handling follows Kovara Banking conventions:
      // - Extract meaningful error messages from Error objects
      // - Provide fallback message for unknown error types
      // - Service layer already handles Sentry error reporting
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch monthly financials";
      setError(errorMessage);
    } finally {
      // Always reset loading state regardless of success/failure
      setLoading(false);
    }
  }, [userId]); // Dependency on userId ensures refetch when user changes

  /**
   * Effect hook to automatically fetch data when component mounts or dependencies change
   *
   * Dependency behavior:
   * - userId: Refetches when user changes (e.g., after authentication)
   * - enabled: Allows conditional data fetching (useful for tab switching, etc.)
   * - fetchFinancials: Included to satisfy exhaustive-deps rule, stable due to useCallback
   *
   * This pattern ensures data freshness while preventing unnecessary API calls
   */
  useEffect(() => {
    if (enabled && userId) {
      fetchFinancials();
    }
  }, [userId, enabled, fetchFinancials]);

  // Return object provides complete control over financial data state
  // Follows React Hook conventions for predictable component integration
  return {
    monthlyFinancials, // Current month's financial data or null
    loading, // Boolean for loading state management
    error, // String error message or null
    refetch: fetchFinancials, // Manual refresh function for user-triggered updates
  };
};
