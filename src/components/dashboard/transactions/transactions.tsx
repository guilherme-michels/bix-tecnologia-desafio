import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import type React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { useTransactions } from "../../../hooks/useTransactions";

interface Filters {
  startDate?: Date;
  endDate?: Date;
  accounts: string[];
  industries: string[];
  states: string[];
  transactionTypes: string[];
  currencies: string[];
}

export const TransactionsTable: React.FC = () => {
  const {
    displayedTransactions,
    isLoading,
    currentPage,
    totalPages,
    loadTransactionsPage,
    setSearchTerm,
    searchTerm,
    allTransactions,
  } = useTransactions(false);

  const formatDateTime = (timestamp: number, isMobile: boolean) => {
    const date = new Date(timestamp);
    if (isMobile) {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
    return date.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string, currency: string) => {
    const value = Number.parseFloat(amount);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value);
  };

  const uniqueAccounts = Array.from(
    new Set(allTransactions.map((t) => t.account)),
  ).sort();
  const uniqueIndustries = Array.from(
    new Set(allTransactions.map((t) => t.industry)),
  ).sort();
  const uniqueStates = Array.from(
    new Set(allTransactions.map((t) => t.state)),
  ).sort();

  const [localFilters, setLocalFilters] = useState<Filters>({
    accounts: [],
    industries: [],
    states: [],
    transactionTypes: [],
    currencies: [],
  });

  const clearFilters = () => {
    setLocalFilters({
      accounts: [],
      industries: [],
      states: [],
      transactionTypes: [],
      currencies: [],
    });
    setSearchTerm("");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      <Flex
        mb={4}
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        gap={2}
      >
        <InputGroup maxWidth={{ base: "100%", md: "200px" }}>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fontSize={isMobile ? "sm" : "md"}
          />
        </InputGroup>
        <Select
          placeholder="Conta"
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              accounts: e.target.value ? [e.target.value] : [],
            })
          }
          maxWidth={{ base: "100%", md: "150px" }}
          value={localFilters.accounts[0] || ""}
          fontSize={isMobile ? "sm" : "md"}
        >
          <option value="">Todas as contas</option>
          {uniqueAccounts.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Indústria"
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              industries: e.target.value ? [e.target.value] : [],
            })
          }
          maxWidth={{ base: "100%", md: "150px" }}
          value={localFilters.industries[0] || ""}
          fontSize={isMobile ? "sm" : "md"}
        >
          <option value="">Todas as indústrias</option>
          {uniqueIndustries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Estado"
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              states: e.target.value ? [e.target.value] : [],
            })
          }
          maxWidth={{ base: "100%", md: "150px" }}
          value={localFilters.states[0] || ""}
          fontSize={isMobile ? "sm" : "md"}
        >
          <option value="">Todos os estados</option>
          {uniqueStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <Button
          onClick={clearFilters}
          colorScheme="blue"
          width={{ base: "100%", md: "auto" }}
          fontSize={isMobile ? "sm" : "md"}
          size={isMobile ? "sm" : "md"}
        >
          Limpar Filtros
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size={isMobile ? "sm" : "md"}>
          <Thead>
            <Tr>
              <Th>Data</Th>
              <Th>Conta</Th>
              {!isMobile && <Th>Indústria</Th>}
              {!isMobile && <Th>Tipo</Th>}
              <Th isNumeric>Valor</Th>
              {!isMobile && <Th>Estado</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={6}>
                  <Flex justify="center" align="center" height="200px">
                    <Spinner />
                  </Flex>
                </Td>
              </Tr>
            ) : displayedTransactions.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Flex
                    justify="center"
                    align="center"
                    height="200px"
                    flexDirection="column"
                  >
                    <FiAlertCircle size={24} color="gray.400" />
                    <Text mt={2} color="gray.500" fontSize="md">
                      Nenhum dado encontrado
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            ) : (
              displayedTransactions.map((transaction, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Tr key={index}>
                  <Td>{formatDateTime(transaction.date, isMobile ?? false)}</Td>
                  <Td>{transaction.account}</Td>
                  {!isMobile && <Td>{transaction.industry}</Td>}
                  {!isMobile && (
                    <Td>
                      <Badge
                        colorScheme={
                          transaction.transaction_type === "deposit"
                            ? "green"
                            : "red"
                        }
                      >
                        {transaction.transaction_type === "deposit"
                          ? "Dep"
                          : "Saq"}
                      </Badge>
                    </Td>
                  )}
                  <Td isNumeric>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={
                        transaction.transaction_type === "deposit"
                          ? "green"
                          : "red"
                      }
                    >
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </Text>
                  </Td>
                  {!isMobile && <Td>{transaction.state}</Td>}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {!isLoading && displayedTransactions.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text fontSize="sm">
            Página {currentPage} de {totalPages}
          </Text>
          <Flex>
            <Button
              onClick={() => loadTransactionsPage(currentPage - 1)}
              isDisabled={currentPage === 1}
              mr={2}
              size="sm"
            >
              Anterior
            </Button>
            <Button
              onClick={() => loadTransactionsPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              size="sm"
            >
              Próxima
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};
