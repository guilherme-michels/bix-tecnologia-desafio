"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { Overview } from "@/components/dashboard/overview/overview";
import { TransactionsTable } from "@/components/dashboard/transactions/transactions";
import { useTransactions } from "../../hooks/useTransactions";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    transactions,
    isLoading,
    currentPage,
    totalPages,
    loadInitialTransactions,
    loadTransactionsPage,
    dashboardData,
  } = useTransactions();

  useEffect(() => {
    loadInitialTransactions();
  }, [loadInitialTransactions]);

  return (
    <Box p={4}>
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <Overview
          transactions={transactions}
          isLoading={isLoading}
          onLoadMore={() => loadTransactionsPage(currentPage + 1)}
          dashboardData={dashboardData}
        />
      )}
      {activeTab === "transactions" && (
        <TransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={loadTransactionsPage}
        />
      )}
      {activeTab === "budget" && <Box>Conteúdo da aba Orçamento</Box>}
    </Box>
  );
}
