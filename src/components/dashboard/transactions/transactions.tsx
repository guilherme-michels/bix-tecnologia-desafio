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
import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import type { Transaction } from "../../../types/dashboard";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.account.toLowerCase().includes(search.toLowerCase()) ||
        transaction.industry.toLowerCase().includes(search.toLowerCase()),
    );
  }, [transactions, search]);

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner />
        </Flex>
      ) : (
        <>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Data e Hora</Th>
                  <Th>Conta</Th>
                  <Th>Indústria</Th>
                  <Th>Tipo</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Estado</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <Tr key={index}>
                    <Td>
                      <Text fontSize="md">
                        {formatDateTime(transaction.date)}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="md">{transaction.account}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="md">{transaction.industry}</Text>
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
                      >
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency,
                        )}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="md">{transaction.state}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Text>
              Página {currentPage} de {totalPages}
            </Text>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};
