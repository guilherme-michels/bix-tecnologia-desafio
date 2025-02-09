import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

interface FilterOption {
  label: string;
  options: string[];
  valueMap?: Record<string, string>;
}

const filterOptions: FilterOption[] = [
  {
    label: "transactionType",
    options: ["Depósito", "Saque"],
    valueMap: {
      Depósito: "deposit",
      Saque: "withdraw",
    },
  },
];

interface DashboardFilterProps {
  activeFilters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export function DashboardFilter({
  activeFilters,
  onFilterChange,
}: DashboardFilterProps) {
  const handleFilterClick = (category: string, option: string) => {
    const updatedFilters = { ...activeFilters };
    const filterOption = filterOptions.find((opt) => opt.label === category);
    const mappedValue = filterOption?.valueMap?.[option] ?? option;

    if (!updatedFilters[category]) {
      updatedFilters[category] = [];
    }

    if (!updatedFilters[category].includes(mappedValue)) {
      updatedFilters[category] = [...updatedFilters[category], mappedValue];
      onFilterChange(updatedFilters);
    }
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        background="white"
        border="1px"
        borderColor="blackAlpha.200"
        width="100%"
        height="100%"
        fontSize={{ base: "xs", md: "sm" }}
        px={2}
        py={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Filtros
      </MenuButton>
      <MenuList>
        {filterOptions.map((filter) => (
          <React.Fragment key={filter.label}>
            {filter.options.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleFilterClick(filter.label, option)}
                fontSize={{ base: "xs", md: "sm" }}
              >
                {option === "Depósito" && <FiArrowUpCircle color="green" />}
                {option === "Saque" && <FiArrowDownCircle color="red" />}
                <Text ml={2}>{option}</Text>
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </MenuList>
    </Menu>
  );
}
