import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/dashboard";
import {
  getTotalTransactionsCount,
  loadAllTransactions,
  loadTransactions,
} from "../utils/transactionUtils";

const ITEMS_PER_PAGE = 10;
const DEFAULT_DAYS = 30;

function parseBrazilianDate(dateString: string): number {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function useTransactions() {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
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
        : new Date().getTime(); // Use a data atual se não houver endDate

      if (endDate) {
        endDate = new Date(endDate).setHours(23, 59, 59, 999);
      }

      const pageTransactions = loadTransactions(
        ITEMS_PER_PAGE,
        offset,
        startDate,
        endDate,
      );
      setDisplayedTransactions((prev) => [...prev, ...pageTransactions]);
      setCurrentPage(page);
      setIsLoading(false);
    },
    [startDateString, endDateString],
  );

  const loadInitialTransactions = useCallback(async () => {
    setIsLoading(true);
    let start: number | undefined;
    let end: number = new Date().getTime(); // Use a data atual como padrão

    if (startDateString) {
      start = parseBrazilianDate(startDateString);
    }
    if (endDateString) {
      end = parseBrazilianDate(endDateString);
    }

    end = new Date(end).setHours(23, 59, 59, 999);

    if (!start) {
      start = end - DEFAULT_DAYS * 24 * 60 * 60 * 1000;
    }

    const total = getTotalTransactionsCount(start, end);
    setTotalTransactions(total);
    const initialTransactions = loadTransactions(ITEMS_PER_PAGE, 0, start, end);
    setDisplayedTransactions(initialTransactions);

    // Carrega todas as transações para o período selecionado
    const allTransactionsForPeriod = loadAllTransactions(start, end);
    setAllTransactions(allTransactionsForPeriod);

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
    isLoading,
    currentPage,
    totalTransactions,
    totalPages: Math.ceil(totalTransactions / ITEMS_PER_PAGE),
    loadInitialTransactions,
    loadTransactionsPage,
    loadMoreTransactions,
    dashboardData,
    moneyFlowData,
  };
}
