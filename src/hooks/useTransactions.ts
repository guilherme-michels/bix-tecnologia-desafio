import { subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/dashboard";
import {
  filterTransactions,
  loadAllTransactions,
  searchTransactions,
} from "../utils/transactionUtils";
import { useDebounce } from "./useDebounce";

const ITEMS_PER_PAGE = 10;
const DEFAULT_DAYS = 30;

function parseBrazilianDate(dateString: string): number {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function useTransactions(isOverview = false) {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    startDate: undefined,
    endDate: undefined,
    accounts: [],
    industries: [],
    states: [],
    transactionTypes: [],
    currencies: [],
  });
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);

  const startDateString = searchParams?.get("startDate") ?? null;
  const endDateString = searchParams?.get("endDate") ?? null;

  const transactionTypes = useMemo(
    () => searchParams?.getAll("transactionType") || [],
    [searchParams],
  );

  const loadInitialTransactions = useCallback(async () => {
    setIsLoading(true);
    let start: number | undefined;
    let end: number | undefined;

    if (startDateString) {
      start = parseBrazilianDate(startDateString);
    } else if (isOverview) {
      start = subDays(new Date(), DEFAULT_DAYS).getTime();
    }

    if (endDateString) {
      end = parseBrazilianDate(endDateString);
      end = new Date(end).setHours(23, 59, 59, 999);
    }

    const allTransactionsForPeriod = loadAllTransactions(
      start,
      end,
      transactionTypes,
    );
    setAllTransactions(allTransactionsForPeriod);

    const total = allTransactionsForPeriod.length;
    setTotalTransactions(total);

    const initialTransactions = allTransactionsForPeriod.slice(
      0,
      ITEMS_PER_PAGE,
    );
    setDisplayedTransactions(initialTransactions);

    setCurrentPage(1);
    setIsLoading(false);
  }, [startDateString, endDateString, isOverview, transactionTypes]);

  const loadTransactionsPage = useCallback(
    (page: number) => {
      setIsLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;

      let filteredTransactions = filterTransactions(allTransactions, filters);
      if (debouncedSearchTerm) {
        filteredTransactions = searchTransactions(
          filteredTransactions,
          debouncedSearchTerm,
        );
      }

      setTotalTransactions(filteredTransactions.length);
      const pageTransactions = filteredTransactions.slice(
        offset,
        offset + ITEMS_PER_PAGE,
      );
      setDisplayedTransactions(pageTransactions);
      setCurrentPage(page);
      setIsLoading(false);
    },
    [allTransactions, debouncedSearchTerm, filters],
  );

  useEffect(() => {
    loadInitialTransactions();
  }, [loadInitialTransactions]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadTransactionsPage(1);
  }, [debouncedSearchTerm, filters, loadTransactionsPage]);

  const dashboardData = useMemo(() => {
    let totalBalance = 0;
    let income = 0;
    let expenses = 0;

    // biome-ignore lint/complexity/noForEach: <explanation>
    allTransactions.forEach((transaction) => {
      const amount = Number.parseFloat(transaction.amount);
      if (transaction.transaction_type === "deposit") {
        income += amount;
        totalBalance += amount;
      } else {
        expenses += amount;
        totalBalance -= amount;
      }
    });

    return { totalBalance, income, expenses };
  }, [allTransactions]);

  const moneyFlowData = useMemo(() => {
    const dailyData: Record<number, { deposits: number; withdrawals: number }> =
      {};

    // biome-ignore lint/complexity/noForEach: <explanation>
    allTransactions.forEach((transaction) => {
      const date = new Date(transaction.date).setHours(0, 0, 0, 0);
      if (!dailyData[date]) {
        dailyData[date] = { deposits: 0, withdrawals: 0 };
      }

      const amount = Number(transaction.amount);
      if (transaction.transaction_type === "deposit") {
        dailyData[date].deposits += amount;
      } else {
        dailyData[date].withdrawals += amount;
      }
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date: Number(date),
        deposits: data.deposits,
        withdrawals: data.withdrawals,
      }))
      .sort((a, b) => a.date - b.date);
  }, [allTransactions]);

  const loadMoreTransactions = useCallback(() => {
    if (isLoading || !hasMoreTransactions) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;
    const offset = displayedTransactions.length;

    let filteredTransactions = filterTransactions(allTransactions, filters);
    if (debouncedSearchTerm) {
      filteredTransactions = searchTransactions(
        filteredTransactions,
        debouncedSearchTerm,
      );
    }

    const newTransactions = filteredTransactions.slice(
      offset,
      offset + ITEMS_PER_PAGE,
    );

    if (newTransactions.length > 0) {
      setDisplayedTransactions((prev) => [...prev, ...newTransactions]);
      setCurrentPage(nextPage);
      setHasMoreTransactions(
        offset + ITEMS_PER_PAGE < filteredTransactions.length,
      );
    } else {
      setHasMoreTransactions(false);
    }

    setIsLoading(false);
  }, [
    isLoading,
    hasMoreTransactions,
    currentPage,
    displayedTransactions.length,
    allTransactions,
    filters,
    debouncedSearchTerm,
  ]);

  const totalPages = useMemo(
    () => Math.ceil(totalTransactions / ITEMS_PER_PAGE),
    [totalTransactions],
  );

  return {
    displayedTransactions,
    allTransactions,
    isLoading,
    currentPage,
    totalTransactions,
    totalPages,
    loadTransactionsPage,
    loadMoreTransactions,
    hasMoreTransactions,
    setSearchTerm,
    searchTerm,
    dashboardData,
    moneyFlowData,
    setFilters,
    filters,
  };
}
