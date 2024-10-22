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
import { DashboardFilter } from "./dashboard-filter";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const filterLabels: Record<string, string> = {
  transactionType: "Tipo de Transação",
  deposit: "Depósito",
  withdrawal: "Saque",
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

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    if (dates.length === 2) {
      const startDate = formatDate(dates[0]);
      const endDate = formatDate(dates[1]);
      updateSearchParams({ ...activeFilters, startDate, endDate });
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
    const updatedFilters: Record<string, string | string[]> = { ...filters };
    if (selectedDates.length === 2) {
      updatedFilters.startDate = formatDate(selectedDates[0]);
      updatedFilters.endDate = formatDate(selectedDates[1]);
    }
    updateSearchParams(updatedFilters);
  };

  const removeFilter = (key: string, value: string) => {
    const updatedFilters = { ...activeFilters };
    if (key === "date") {
      setSelectedDates([]);
    } else {
      updatedFilters[key] = updatedFilters[key].filter((v) => v !== value);
      if (updatedFilters[key].length === 0) {
        delete updatedFilters[key];
      }
    }
    setActiveFilters(updatedFilters);
    updateSearchParams(updatedFilters, key === "date" ? [] : selectedDates);
  };

  const updateSearchParams = (
    params: Record<string, string | string[]>,
    dates: Date[] = selectedDates,
  ) => {
    const newParams = new URLSearchParams();
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        value.forEach((v) => newParams.append(key, v));
      } else if (value) {
        newParams.append(key, value);
      }
    });
    if (dates.length === 2) {
      newParams.set("startDate", formatDate(dates[0]));
      newParams.set("endDate", formatDate(dates[1]));
    }
    router.push(`/dashboard?${newParams.toString()}`);
  };

  const formatDateRange = (dates: Date[]): string => {
    if (dates.length !== 2) return "";
    const [start, end] = dates;
    return `${formatDate(start)} - ${formatDate(end)}`;
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

          <Box ml={2}>
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
          <Text fontSize={"sm"} mr={2} mb={2}>
            Filtrando por:
          </Text>
          <Flex flexWrap="wrap">
            {selectedDates.length === 2 && (
              <Tag
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                mr={2}
                mb={2}
                fontSize={"xs"}
              >
                <TagLabel>Período: {formatDateRange(selectedDates)}</TagLabel>
                <TagCloseButton onClick={() => removeFilter("date", "")} />
              </Tag>
            )}
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map((value) => (
                <Tag
                  key={`${key}-${value}`}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                  mr={2}
                  mb={2}
                  fontSize={"xs"}
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
        onChange={(index) =>
          onTabChange(["overview", "transactions", "budget"][index])
        }
      >
        <TabList>
          <Tab>Visão Geral</Tab>
          <Tab>Transações</Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
      </Tabs>
    </Box>
  );
}
