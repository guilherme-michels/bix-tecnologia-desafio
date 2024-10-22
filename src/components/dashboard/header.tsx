"use client";

import {
  Box,
  Flex,
  Heading,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  useEffect(() => {
    const startDate = searchParams?.get("startDate");
    const endDate = searchParams?.get("endDate");
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
      updateSearchParams({ startDate, endDate });
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
    setActiveFilters(filters);
    updateSearchParams(filters);
  };

  const removeFilter = (key: string, value: string) => {
    const updatedFilters = { ...activeFilters };
    updatedFilters[key] = updatedFilters[key].filter((v) => v !== value);
    if (updatedFilters[key].length === 0) {
      delete updatedFilters[key];
    }
    setActiveFilters(updatedFilters);
    updateSearchParams(updatedFilters);
  };
  const updateSearchParams = (params: Record<string, string | string[]>) => {
    const currentParams = new URLSearchParams(searchParams?.toString() ?? "");
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        currentParams.delete(key);
        // biome-ignore lint/complexity/noForEach: <explanation>
        value.forEach((v) => currentParams.append(key, v));
      } else {
        currentParams.set(key, value);
      }
    });
    router.push(`/dashboard?${currentParams.toString()}`);
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
      {Object.keys(activeFilters).length > 0 && (
        <Flex align="center" mt={2} mb={4}>
          <Text fontWeight="bold" mr={2}>
            Filtrando por:
          </Text>
          {Object.entries(activeFilters).map(([key, values]) =>
            values.map((value) => (
              <Tag
                key={`${key}-${value}`}
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                mr={2}
              >
                <TagLabel>{`${key}: ${value}`}</TagLabel>
                <TagCloseButton onClick={() => removeFilter(key, value)} />
              </Tag>
            )),
          )}
        </Flex>
      )}
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
