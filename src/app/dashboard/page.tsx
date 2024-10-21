"use client";

import { DashboardFilter } from "@/components/dashboard/dashboard-filter";
import { DashboardHeader } from "@/components/dashboard/header";
import { Overview } from "@/components/dashboard/overview/overview";
import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Box>
      <DashboardHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <Box mt="6">
        {activeTab === "overview" && <Overview />}

        {activeTab === "transactions" && (
          <Box>
            <Text fontSize="lg" fontWeight="medium">
              Lista de Transações
            </Text>
          </Box>
        )}

        {activeTab === "budget" && (
          <Box>
            <Text fontSize="lg" fontWeight="medium">
              Orçamento
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
