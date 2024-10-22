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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchParams = useSearchParams();

  const startDateString = searchParams?.get("startDate") ?? null;
  const endDateString = searchParams?.get("endDate") ?? null;
  const transactionTypes = searchParams?.getAll("Tipo de Transação") ?? [];
  const currencies = searchParams?.getAll("Moeda") ?? [];

  const loadTransactions = useCallback(async () => {
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

    const allTransactions = loadAllTransactions(start, end);
    setTransactions(allTransactions);
    setIsLoading(false);
  }, [startDateString, endDateString, isOverview]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactions(
      transactions,
      transactionTypes,
      currencies,
    );
    if (debouncedSearchTerm) {
      filtered = searchTransactions(filtered, debouncedSearchTerm);
    }
    return filtered;
  }, [transactions, transactionTypes, currencies, debouncedSearchTerm]);

  const displayedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage]);

  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

  const loadTransactionsPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const dashboardData = useMemo(() => {
    let totalBalance = 0;
    let income = 0;
    let expenses = 0;

    // biome-ignore lint/complexity/noForEach: <explanation>
    filteredTransactions.forEach((transaction) => {
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
  }, [filteredTransactions]);

  const moneyFlowData = useMemo(() => {
    const dailyData: Record<number, { deposits: number; withdrawals: number }> =
      {};

    // biome-ignore lint/complexity/noForEach: <explanation>
    filteredTransactions.forEach((transaction) => {
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
  }, [filteredTransactions]);

  const loadMoreTransactions = useCallback(() => {
    if (!isLoading && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, currentPage, totalPages]);

  const loadInitialTransactions = useCallback(async () => {
    await loadTransactions();
    setCurrentPage(1);
  }, [loadTransactions]);

  return {
    displayedTransactions,
    isLoading,
    currentPage,
    totalTransactions,
    totalPages,
    loadInitialTransactions,
    loadTransactionsPage,
    setSearchTerm,
    searchTerm,
    dashboardData,
    moneyFlowData,
    loadMoreTransactions,
  };
}
