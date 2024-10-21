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
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
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

  const parseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    try {
      return parse(dateString, "dd/MM/yyyy", new Date());
    } catch {
      return null;
    }
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const startDate = parseDate(searchParams.get("startDate"));
    const endDate = parseDate(searchParams.get("endDate"));
    if (startDate && endDate) {
      setSelectedDates([startDate, endDate]);
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
