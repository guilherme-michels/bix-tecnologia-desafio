import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";

interface Transaction {
  date: number;
  amount: string;
  transaction_type: "deposit" | "withdrawal";
  currency: string;
  account: string;
  industry: string;
  state: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const transactionsPerLoad = 7;
  const observerTarget = useRef(null);

  const loadMoreTransactions = useCallback(() => {
    const newTransactions = transactions.slice(
      currentIndex,
      currentIndex + transactionsPerLoad,
    );
    setDisplayedTransactions((prev) => [...prev, ...newTransactions]);
    setCurrentIndex((prev) => prev + transactionsPerLoad);
  }, [currentIndex, transactions]);

  useEffect(() => {
    loadMoreTransactions();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isScrollEnabled) {
          loadMoreTransactions();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isScrollEnabled, loadMoreTransactions]);

  const enableScroll = () => {
    setIsScrollEnabled(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatCurrency = (amount: string, currency: string) => {
    const value = Number.parseFloat(amount);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p="4"
      height="520px"
      display="flex"
      flexDirection="column"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Transações Recentes
        </Text>
        {!isScrollEnabled && (
          <Button onClick={enableScroll} size="sm" variant="outline">
            Ver mais
          </Button>
        )}
      </Flex>
      <VStack
        spacing={2}
        align="stretch"
        flex={1}
        overflowY={isScrollEnabled ? "auto" : "hidden"}
      >
        {displayedTransactions.map((transaction, index) => (
          <Flex
            key={index}
            justify="space-between"
            align="center"
            py={2}
            px={3}
            borderRadius="md"
            borderColor={"blackAlpha.200"}
            borderWidth={1}
          >
            <HStack spacing={3}>
              {transaction.transaction_type === "deposit" ? (
                <FiArrowUpRight color="green" />
              ) : (
                <FiArrowDownLeft color="red" />
              )}
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium" fontSize="sm">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {transaction.account}
                </Text>
              </VStack>
            </HStack>
            <VStack align="end" spacing={2}>
              <Text fontSize="xs" color="gray.600">
                {formatDate(transaction.date)}
              </Text>
              <HStack>
                <Badge
                  size="sm"
                  colorScheme={
                    transaction.transaction_type === "deposit" ? "green" : "red"
                  }
                  fontSize="2xs"
                  px={1}
                >
                  {transaction.transaction_type === "deposit"
                    ? "Entrada"
                    : "Saída"}
                </Badge>
                <Badge colorScheme="purple" fontSize="2xs" px={1}>
                  {transaction.industry}
                </Badge>
              </HStack>
            </VStack>
          </Flex>
        ))}
        <Box ref={observerTarget} height="1px" />
      </VStack>
    </Box>
  );
}
