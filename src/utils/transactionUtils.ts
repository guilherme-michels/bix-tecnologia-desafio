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
  transactionTypes?: string[],
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

  if (transactionTypes && transactionTypes.length > 0) {
    filteredTransactions = filteredTransactions.filter((t: Transaction) =>
      transactionTypes.includes(t.transaction_type),
    );
  }

  return filteredTransactions.sort(
    (a: Transaction, b: Transaction) => b.date - a.date,
  );
}

export function filterTransactions(
  transactions: Transaction[],
  filters: {
    startDate?: number;
    endDate?: number;
    accounts?: string[];
    industries?: string[];
    states?: string[];
    transactionTypes?: string[];
    currencies?: string[];
  },
): Transaction[] {
  return transactions.filter((transaction) => {
    const dateMatch =
      (!filters.startDate || transaction.date >= filters.startDate) &&
      (!filters.endDate || transaction.date <= filters.endDate);
    const accountMatch =
      !filters.accounts ||
      filters.accounts.length === 0 ||
      filters.accounts.includes(transaction.account);
    const industryMatch =
      !filters.industries ||
      filters.industries.length === 0 ||
      filters.industries.includes(transaction.industry);
    const stateMatch =
      !filters.states ||
      filters.states.length === 0 ||
      filters.states.includes(transaction.state);
    const typeMatch =
      !filters.transactionTypes ||
      filters.transactionTypes.length === 0 ||
      filters.transactionTypes.includes(transaction.transaction_type);
    const currencyMatch =
      !filters.currencies ||
      filters.currencies.length === 0 ||
      filters.currencies.includes(transaction.currency);

    return (
      dateMatch &&
      accountMatch &&
      industryMatch &&
      stateMatch &&
      typeMatch &&
      currencyMatch
    );
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
