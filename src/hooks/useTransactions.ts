import { subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/dashboard";
import {
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

  const startDateString = searchParams?.get("startDate") ?? null;
  const endDateString = searchParams?.get("endDate") ?? null;

  const transactionTypes = searchParams?.getAll("transactionType") || [];

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

      let filteredTransactions = allTransactions;
      if (debouncedSearchTerm) {
        filteredTransactions = searchTransactions(
          allTransactions,
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
    [allTransactions, debouncedSearchTerm],
  );

  useEffect(() => {
    loadInitialTransactions();
  }, [loadInitialTransactions]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadTransactionsPage(1);
  }, [debouncedSearchTerm, loadTransactionsPage]);

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
    if (!isLoading) {
      loadTransactionsPage(currentPage + 1);
    }
  }, [isLoading, currentPage, loadTransactionsPage]);

  return {
    displayedTransactions,
    allTransactions,
    isLoading,
    currentPage,
    totalTransactions,
    totalPages: Math.ceil(totalTransactions / ITEMS_PER_PAGE),
    loadInitialTransactions,
    loadTransactionsPage,
    setSearchTerm,
    searchTerm,
    dashboardData,
    moneyFlowData,
    loadMoreTransactions,
  };
}
