import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface FilterOption {
  label: string;
  options: string[];
  valueMap?: Record<string, string>;
}

const filterOptions: FilterOption[] = [
  {
    label: "Tipo de Transação",
    options: ["Depósito", "Saque"],
    valueMap: {
      Depósito: "deposit",
      Saque: "withdrawal",
    },
  },
  {
    label: "Moeda",
    options: ["BRL", "USD"],
  },
];

interface DashboardFilterProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export function DashboardFilter({ onFilterChange }: DashboardFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

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

      const mappedFilters = Object.entries(updatedFilters).reduce(
        (acc, [key, values]) => {
          const filterOption = filterOptions.find((opt) => opt.label === key);
          if (filterOption?.valueMap) {
            acc[key] = values.map((v) => filterOption.valueMap?.[v] ?? v);
          } else {
            acc[key] = values;
          }
          return acc;
        },
        {} as Record<string, string[]>,
      );

      onFilterChange(mappedFilters);
      return updatedFilters;
    });
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
      <MenuList>
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
