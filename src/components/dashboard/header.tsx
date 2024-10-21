"use client";

import {
  Box,
  Flex,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardFilter } from "./dashboard-filter";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardHeader({
  activeTab,
  onTabChange,
}: DashboardHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) {
      setSelectedDates([new Date(startDate), new Date(endDate)]);
    }
  }, [searchParams]);

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    if (dates.length === 2) {
      const startDate = formatDate(dates[0]);
      const endDate = formatDate(dates[1]);
      router.push(`/dashboard?startDate=${startDate}&endDate=${endDate}`);
    }
  };

  const formatDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    console.log("Filtros aplicados:", filters);
  };

  return (
    <Box mb="6">
      <Flex align="center" justify="space-between" mb="4">
        <Flex align="center">
          <Box w="10px" h="10px" borderRadius="full" bg="green.400" mr="3" />
          <Heading fontSize={24}>Dashboard</Heading>
        </Flex>
        <Flex align="center">
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={handleDateChange}
            configs={{
              dateFormat: "dd/MM/yyyy",
              dayNames: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
              monthNames: [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro",
              ],
              firstDayOfWeek: 0,
            }}
            propsConfigs={{
              inputProps: {
                placeholder: "Selecione as datas",
                size: "sm",
              },
            }}
          />
          <Box ml={4}>
            <DashboardFilter onFilterChange={handleFilterChange} />
          </Box>
        </Flex>
      </Flex>
      <Tabs
        variant="unstyled"
        colorScheme="black"
        value={activeTab}
        onChange={(index) =>
          onTabChange(["overview", "transactions", "budget"][index])
        }
      >
        <TabList>
          <Tab>Visão Geral</Tab>
          <Tab>Transações</Tab>
          <Tab>Orçamento</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
      </Tabs>
    </Box>
  );
}
