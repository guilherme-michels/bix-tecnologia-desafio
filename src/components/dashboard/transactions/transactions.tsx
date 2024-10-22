import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type React from "react";
import { FaSearch } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { useTransactions } from "../../../hooks/useTransactions";

export const TransactionsTable: React.FC = () => {
  const {
    displayedTransactions,
    isLoading,
    currentPage,
    totalPages,
    loadTransactionsPage,
    setSearchTerm,
    searchTerm,
  } = useTransactions(false);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
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

  return (
    <Box>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Buscar por conta ou indústria"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <TableContainer>
        <Table variant="simple" size="md" layout="fixed">
          <Thead>
            <Tr>
              <Th width="20%">Data e Hora</Th>
              <Th width="20%">Conta</Th>
              <Th width="20%">Indústria</Th>
              <Th width="10%">Tipo</Th>
              <Th width="15%" isNumeric>
                Valor
              </Th>
              <Th width="15%">Estado</Th>
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
                  <Td>
                    <Text fontSize="md" isTruncated>
                      {formatDateTime(transaction.date)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="md" isTruncated>
                      {transaction.account}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="md" isTruncated>
                      {transaction.industry}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        transaction.transaction_type === "deposit"
                          ? "green"
                          : "red"
                      }
                    >
                      {transaction.transaction_type === "deposit"
                        ? "Depósito"
                        : "Saque"}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    <Text
                      fontSize="md"
                      fontWeight={"bold"}
                      color={
                        transaction.transaction_type === "deposit"
                          ? "green"
                          : "red"
                      }
                      isTruncated
                    >
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="md" isTruncated>
                      {transaction.state}
                    </Text>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {!isLoading && displayedTransactions.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text>
            Página {currentPage} de {totalPages}
          </Text>
          <Flex>
            <Button
              onClick={() => loadTransactionsPage(currentPage - 1)}
              isDisabled={currentPage === 1}
              mr={2}
            >
              Anterior
            </Button>
            <Button
              onClick={() => loadTransactionsPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};
