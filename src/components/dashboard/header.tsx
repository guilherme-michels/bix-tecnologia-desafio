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
  useBreakpointValue,
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DashboardFilter } from "./dashboard-filter";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const filterLabels: Record<string, string> = {
  transactionType: "Tipo de Transação",
  deposit: "Depósito",
  withdraw: "Saque",
};

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
    const transactionTypes = searchParams?.getAll("transactionType") || [];

    if (startDate && endDate) {
      setSelectedDates([
        parseBrazilianDate(startDate),
        parseBrazilianDate(endDate),
      ]);
    } else {
      setSelectedDates([]);
    }

    if (transactionTypes.length > 0) {
      setActiveFilters({ transactionType: transactionTypes });
    } else {
      setActiveFilters({});
    }
  }, [searchParams]);

  useEffect(() => {
    const newParams = new URLSearchParams();

    if (selectedDates.length === 2) {
      newParams.set("startDate", formatDate(selectedDates[0]));
      newParams.set("endDate", formatDate(selectedDates[1]));
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(activeFilters).forEach(([key, values]) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      values.forEach((value) => newParams.append(key, value));
    });

    router.push(`/dashboard?${newParams.toString()}`);
  }, [selectedDates, activeFilters, router]);

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  };

  const removeFilter = (key: string, value: string) => {
    if (key === "date") {
      setSelectedDates([]);
    } else {
      const updatedFilters = { ...activeFilters };
      updatedFilters[key] = updatedFilters[key].filter((v) => v !== value);
      if (updatedFilters[key].length === 0) {
        delete updatedFilters[key];
      }
      setActiveFilters(updatedFilters);
    }
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const parseBrazilianDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateRange = (dates: Date[]): string => {
    if (dates.length !== 2) return "";
    const [start, end] = dates;
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const handleTabChange = useCallback(
    (index: number) => {
      const tabs = ["overview", "transactions", "budget"];
      onTabChange(tabs[index]);
    },
    [onTabChange],
  );

  return (
    <Box mb="6">
      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        mb="4"
        wrap="wrap"
      >
        <Flex align="center" mb={{ base: 4, sm: 0 }}>
          <Box w="10px" h="10px" borderRadius="full" bg="green.400" mr="3" />
          <Heading fontSize={{ base: 20, md: 24 }}>Dashboard</Heading>
        </Flex>
        <Flex
          width={{ base: "100%", sm: "auto" }}
          justify="flex-end"
          align="stretch"
        >
          <Box width={{ base: "70%", sm: "200px" }} mr={4}>
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
                  width: "100%",
                },
                dateNavBtnProps: {
                  colorScheme: "blue",
                  variant: "outline",
                },
                dayOfMonthBtnProps: {
                  defaultBtnProps: {
                    borderColor: "blue.300",
                    _hover: {
                      background: "blue.400",
                    },
                  },
                  selectedBtnProps: {
                    background: "blue.500",
                    color: "white",
                  },
                },
              }}
            />
          </Box>
          <Box width={{ base: "30%", sm: "100px" }}>
            <DashboardFilter
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          </Box>
        </Flex>
      </Flex>
      {(Object.keys(activeFilters).length > 0 ||
        selectedDates.length === 2) && (
        <Flex align="center" mt={2} mb={4} flexWrap="wrap">
          <Text fontSize="xs" mr={2} mb={2}>
            Filtrando por:
          </Text>
          <Flex flexWrap="wrap">
            {selectedDates.length === 2 && (
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                mr={2}
                mb={2}
                fontSize="xs"
              >
                <TagLabel>Período: {formatDateRange(selectedDates)}</TagLabel>
                <TagCloseButton onClick={() => removeFilter("date", "")} />
              </Tag>
            )}
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map((value) => (
                <Tag
                  key={`${key}-${value}`}
                  size="sm"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                  mr={2}
                  mb={2}
                  fontSize="xs"
                >
                  <TagLabel>{`${filterLabels[key] || key}: ${filterLabels[value] || value}`}</TagLabel>
                  <TagCloseButton onClick={() => removeFilter(key, value)} />
                </Tag>
              )),
            )}
          </Flex>
        </Flex>
      )}
      <Tabs
        variant="unstyled"
        colorScheme="black"
        index={["overview", "transactions", "budget"].indexOf(activeTab)}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab fontSize={{ base: "sm", md: "md" }}>Visão Geral</Tab>
          <Tab fontSize={{ base: "sm", md: "md" }}>Transações</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
      </Tabs>
    </Box>
  );
}
