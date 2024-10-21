"use client";

import {
  Box,
  Flex,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
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
      setSelectedDates([
        parseBrazilianDate(startDate),
        parseBrazilianDate(endDate),
      ]);
    }
  }, [searchParams]);

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    if (dates.length === 2) {
      const startDate = formatDate(dates[0]);
      const endDate = formatDate(dates[1]);
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("startDate", startDate);
      currentParams.set("endDate", endDate);
      router.push(`/dashboard?${currentParams.toString()}`);
    }
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const parseBrazilianDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    console.log("Filtros aplicados:", filters);
  };

  const { dashboardData } = useTransactions();

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
        index={["overview", "transactions", "budget"].indexOf(activeTab)}
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
