"use client";

import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { Overview } from "@/components/dashboard/overview/overview";
import { TransactionsTable } from "@/components/dashboard/transactions/transactions";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Box p={4}>
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && <Overview />}
      {activeTab === "transactions" && <TransactionsTable />}
      {activeTab === "budget" && <Box>Conteúdo da aba Orçamento</Box>}
    </Box>
  );
}
