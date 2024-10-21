import type { Transaction } from "@/types/dashboard";
import transactionsData from "../transactions.json";

export function loadTransactions(
  limit = 7,
  offset = 0,
  startDate?: number,
  endDate?: number,
): Transaction[] {
  let filteredTransactions = transactionsData;
  if (startDate) {
    filteredTransactions = (filteredTransactions as Transaction[]).filter(
      (t: Transaction) => t.date >= startDate,
    );
  }

  if (endDate) {
    filteredTransactions = (filteredTransactions as Transaction[]).filter(
      (t: Transaction) => t.date <= endDate,
    );
  }

  const sortedTransactions = (filteredTransactions as Transaction[]).sort(
    (a: Transaction, b: Transaction) => b.date - a.date,
  );

  return sortedTransactions
    .slice(offset, offset + limit)
    .map((transaction: Transaction) => ({
      date: transaction.date,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      currency: transaction.currency,
      account: transaction.account,
      industry: transaction.industry,
      state: transaction.state,
    }));
}

export function getTotalTransactionsCount(
  startDate?: number,
  endDate?: number,
): number {
  let filteredTransactions = transactionsData;
  if (startDate) {
    filteredTransactions = (filteredTransactions as Transaction[]).filter(
      (t: Transaction) => t.date >= startDate,
    );
  }
  if (endDate) {
    filteredTransactions = (filteredTransactions as Transaction[]).filter(
      (t: Transaction) => t.date <= endDate,
    );
  }

  return (filteredTransactions as Transaction[]).length;
}
