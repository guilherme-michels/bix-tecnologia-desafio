import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { format, subMonths } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface FilterOption {
  label: string;
  options: string[];
}

const filterOptions: FilterOption[] = [
  {
    label: "Tipo de Transação",
    options: ["deposit", "withdrawal"],
  },
  {
    label: "Moeda",
    options: ["brl", "usd"],
  },
  {
    label: "Indústria",
    options: ["Food Consumer Products", "Hotels"],
  },
  {
    label: "Estado",
    options: ["MN", "NV"],
  },
];

interface DashboardFilterProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export function DashboardFilter({ onFilterChange }: DashboardFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const toast = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (startDateParam && endDateParam) {
      setStartDate(convertToISODate(startDateParam));
      setEndDate(convertToISODate(endDateParam));
    } else {
      // Se não houver datas nos parâmetros, use os últimos 6 meses
      const end = new Date();
      const start = subMonths(end, 6);
      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));

      // Atualize a URL com as novas datas
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("startDate", format(start, "dd/MM/yyyy"));
      newSearchParams.set("endDate", format(end, "dd/MM/yyyy"));
      router.push(`/dashboard?${newSearchParams.toString()}`);
    }
  }, [searchParams, router]);

  const convertToISODate = (dateString: string): string => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const convertToBrazilianDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleFilterChange = (category: string, option: string) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[category]) {
        updatedFilters[category] = [];
      }
      const index = updatedFilters[category].indexOf(option);
      if (index > -1) {
        updatedFilters[category].splice(index, 1);
      } else {
        updatedFilters[category].push(option);
      }
      if (updatedFilters[category].length === 0) {
        delete updatedFilters[category];
      }
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleDateChange = (date: string | null, isStartDate: boolean) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (date) {
      const selectedDate = new Date(date);
      if (selectedDate > today) {
        toast({
          title: "Data inválida",
          description: "Selecione uma data válida no passado",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const newDate = date ? convertToBrazilianDate(date) : null;

    if (isStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    const currentSearchParams = new URLSearchParams(window.location.search);
    if (isStartDate) {
      if (newDate) {
        currentSearchParams.set("startDate", newDate);
      } else {
        currentSearchParams.delete("startDate");
      }
    } else {
      if (newDate) {
        currentSearchParams.set("endDate", newDate);
      } else {
        currentSearchParams.delete("endDate");
      }
    }

    // Se ambas as datas forem removidas, defina o período para os últimos 6 meses
    if (
      !currentSearchParams.get("startDate") &&
      !currentSearchParams.get("endDate")
    ) {
      const end = new Date();
      const start = subMonths(end, 6);
      currentSearchParams.set("startDate", format(start, "dd/MM/yyyy"));
      currentSearchParams.set("endDate", format(end, "dd/MM/yyyy"));
      setStartDate(format(start, "yyyy-MM-dd"));
      setEndDate(format(end, "yyyy-MM-dd"));
    }

    router.push(`/dashboard?${currentSearchParams.toString()}`);
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        background={"white"}
        border={"1px"}
        borderColor={"blackAlpha.300"}
      >
        Filtros
      </MenuButton>
      <MenuList maxHeight="300px" overflowY="auto">
        <MenuItem onClick={(e) => e.preventDefault()}>
          <VStack align="start" spacing={2} width="100%">
            <Text fontWeight="bold">Período</Text>
            <Input
              type="date"
              value={startDate || ""}
              onChange={(e) => handleDateChange(e.target.value, true)}
              placeholder="Data inicial"
            />
            <Input
              type="date"
              value={endDate || ""}
              onChange={(e) => handleDateChange(e.target.value, false)}
              placeholder="Data final"
            />
          </VStack>
        </MenuItem>
        {filterOptions.map((filter) => (
          <MenuItem key={filter.label} onClick={(e) => e.preventDefault()}>
            <VStack align="start" spacing={2} width="100%">
              <Text fontWeight="bold">{filter.label}</Text>
              {filter.options.map((option) => (
                <Checkbox
                  key={option}
                  isChecked={selectedFilters[filter.label]?.includes(option)}
                  onChange={() => handleFilterChange(filter.label, option)}
                >
                  {option}
                </Checkbox>
              ))}
            </VStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
