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

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} rightIcon={<FaChevronDown />}>
        Filtros
      </MenuButton>
      <MenuList maxHeight="300px" overflowY="auto">
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
