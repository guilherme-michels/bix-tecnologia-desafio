import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/dashboard";
import {
  getTotalTransactionsCount,
  loadTransactions,
} from "../utils/transactionUtils";

const ITEMS_PER_PAGE = 10;
const DEFAULT_DAYS = 30;

function parseBrazilianDate(dateString: string): number {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const searchParams = useSearchParams();

  const startDateString = searchParams.get("startDate");
  const endDateString = searchParams.get("endDate");

  const loadTransactionsPage = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const startDate = startDateString
        ? parseBrazilianDate(startDateString)
        : undefined;
      let endDate = endDateString
        ? parseBrazilianDate(endDateString)
        : undefined;

      if (endDate) {
        endDate = new Date(endDate).setHours(23, 59, 59, 999);
      }

      const pageTransactions = loadTransactions(
        ITEMS_PER_PAGE,
        offset,
        startDate,
        endDate,
      );
      setTransactions(pageTransactions);
      setCurrentPage(page);
      setIsLoading(false);
    },
    [startDateString, endDateString],
  );

  const loadInitialTransactions = useCallback(async () => {
    setIsLoading(true);
    let start: number | undefined;
    let end: number | undefined;

    if (startDateString) {
      start = parseBrazilianDate(startDateString);
    }
    if (endDateString) {
      end = parseBrazilianDate(endDateString);
      end = new Date(end).setHours(23, 59, 59, 999);
    }

    if (!start && !end) {
      end = new Date().setHours(23, 59, 59, 999);
      start = end - DEFAULT_DAYS * 24 * 60 * 60 * 1000;
    }
    const total = getTotalTransactionsCount(start, end);
    setTotalTransactions(total);
    const initialTransactions = loadTransactions(ITEMS_PER_PAGE, 0, start, end);
    setTransactions(initialTransactions);
    setCurrentPage(1);
    setIsLoading(false);
  }, [startDateString, endDateString]);

  useEffect(() => {
    loadInitialTransactions();
  }, [loadInitialTransactions]);

  const dashboardData = useMemo(() => {
    let totalBalance = 0;
    let income = 0;
    let expenses = 0;

    // biome-ignore lint/complexity/noForEach: <explanation>
    transactions.forEach((transaction) => {
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
  }, [transactions]);

  const moneyFlowData = useMemo(() => {
    const monthlyData: Record<
      string,
      { deposits: number; withdrawals: number }
    > = {};

    // biome-ignore lint/complexity/noForEach: <explanation>
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = format(date, "MMM yyyy", { locale: ptBR });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { deposits: 0, withdrawals: 0 };
      }

      const amount = Number(transaction.amount);
      if (transaction.transaction_type === "deposit") {
        monthlyData[monthKey].deposits += amount;
      } else {
        monthlyData[monthKey].withdrawals += amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        deposits: data.deposits,
        withdrawals: data.withdrawals,
      }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
      );
  }, [transactions]);

  return {
    transactions,
    isLoading,
    currentPage,
    totalTransactions,
    totalPages: Math.ceil(totalTransactions / ITEMS_PER_PAGE),
    loadInitialTransactions,
    loadTransactionsPage,
    dashboardData,
    moneyFlowData,
  };
}
