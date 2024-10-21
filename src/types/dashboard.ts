export interface DashboardData {
  totalBalance: number;
  income: number;
  expenses: number;
  recentTransactions: Transaction[];
}

export interface Transaction {
  date: number;
  amount: string;
  transaction_type: "deposit" | "withdrawal";
  currency: string;
  account: string;
  industry: string;
  state: string;
}
