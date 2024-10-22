import type { Transaction } from "@/types/dashboard";
import transactionsData from "../transactions.json";

export function loadTransactions(
  limit = 7,
  offset = 0,
  startDate?: number,
  endDate?: number,
): Transaction[] {
  let filteredTransactions = transactionsData as Transaction[];

  if (startDate) {
    filteredTransactions = filteredTransactions.filter(
      (t: Transaction) => t.date >= startDate,
    );
  }

  if (endDate) {
    filteredTransactions = filteredTransactions.filter(
      (t: Transaction) => t.date <= endDate,
    );
  }

  const sortedTransactions = filteredTransactions.sort(
    (a: Transaction, b: Transaction) => b.date - a.date,
  );

  return sortedTransactions.slice(offset, offset + limit);
}

export function getTotalTransactionsCount(
  startDate?: number,
  endDate?: number,
): number {
  let filteredTransactions = transactionsData as Transaction[];

  if (startDate) {
    filteredTransactions = filteredTransactions.filter(
      (t: Transaction) => t.date >= startDate,
    );
  }
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(
      (t: Transaction) => t.date <= endDate,
    );
  }

  return filteredTransactions.length;
}

export function loadAllTransactions(
  startDate?: number,
  endDate?: number,
): Transaction[] {
  let filteredTransactions = transactionsData as Transaction[];

  if (startDate) {
    filteredTransactions = filteredTransactions.filter(
      (t: Transaction) => t.date >= startDate,
    );
  }

  if (endDate) {
    filteredTransactions = filteredTransactions.filter(
      (t: Transaction) => t.date <= endDate,
    );
  }

  return filteredTransactions.sort(
    (a: Transaction, b: Transaction) => b.date - a.date,
  );
}

export function filterTransactions(
  transactions: Transaction[],
  transactionTypes: string[],
  currencies: string[],
): Transaction[] {
  return transactions.filter((transaction) => {
    const typeMatch =
      transactionTypes.length === 0 ||
      transactionTypes.includes(transaction.transaction_type);
    const currencyMatch =
      currencies.length === 0 || currencies.includes(transaction.currency);
    return typeMatch && currencyMatch;
  });
}

export function searchTransactions(
  transactions: Transaction[],
  searchTerm: string,
): Transaction[] {
  const lowercasedTerm = searchTerm.toLowerCase();
  return transactions.filter(
    (transaction) =>
      transaction.account.toLowerCase().includes(lowercasedTerm) ||
      transaction.industry.toLowerCase().includes(lowercasedTerm),
  );
}
