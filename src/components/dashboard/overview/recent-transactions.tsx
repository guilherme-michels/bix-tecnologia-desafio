import type { Transaction } from "@/types/dashboard";
import {
  Badge,
  Box,
  Center,
  Flex,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiAlertCircle, FiMinus, FiPlus } from "react-icons/fi";

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  onLoadMore: () => void;
}

const NoDataFound = () => (
  <Center height="100%" flexDirection="column">
    <FiAlertCircle size={24} color="gray.400" />
    <Text mt={2} color="gray.500" fontSize="md">
      Nenhum dado encontrado
    </Text>
  </Center>
);

export function RecentTransactions({
  transactions,
  isLoading,
  onLoadMore,
}: RecentTransactionsProps) {
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const observerTarget = useRef(null);

  useEffect(() => {
    setDisplayedTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
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
  }, [onLoadMore, isLoading]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: string, currency: string | undefined) => {
    const value = Number.parseFloat(amount);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: (currency || "BRL").toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const TransactionSkeleton = () => (
    <Flex
      justify="space-between"
      align="center"
      py={2}
      px={3}
      borderRadius="md"
      borderColor="blackAlpha.200"
      borderWidth={1}
      height="100px"
    >
      <HStack spacing={3}>
        <Skeleton width="30px" height="30px" borderRadius="md" />
        <VStack align="start" spacing={0}>
          <Skeleton height="18px" width="80px" />
          <Skeleton height="14px" width="100px" mt={1} />
        </VStack>
      </HStack>
      <VStack align="end" spacing={2}>
        <Skeleton height="14px" width="60px" />
        <Skeleton height="18px" width="80px" />
      </VStack>
    </Flex>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <Flex
      justify="space-between"
      align="center"
      py={2}
      px={3}
      borderRadius="md"
      borderColor="blackAlpha.200"
      borderWidth={1}
      height="100px"
    >
      <HStack spacing={3}>
        <Box
          width="30px"
          height="30px"
          borderRadius="md"
          bg={
            transaction.transaction_type === "deposit" ? "green.100" : "red.100"
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {transaction.transaction_type === "deposit" ? (
            <FiPlus color="green" />
          ) : (
            <FiMinus color="red" />
          )}
        </Box>
        <VStack align="start" spacing={0}>
          <Text
            fontWeight="medium"
            fontSize="sm"
            color={
              transaction.transaction_type === "deposit"
                ? "green.500"
                : "red.500"
            }
          >
            {formatCurrency(transaction.amount, transaction.currency)}
          </Text>
          <Text fontSize="xs" color="gray.600" mt={1}>
            {transaction.account}
          </Text>
        </VStack>
      </HStack>
      <VStack align="end" spacing={2}>
        <Text fontSize="xs" color="gray.600">
          {formatDate(transaction.date)}
        </Text>
        <Badge
          colorScheme="blackAlpha"
          fontSize="2xs"
          px={1}
          border={"1px"}
          borderColor={"blackAlpha.200"}
        >
          {transaction.industry}
        </Badge>
      </VStack>
    </Flex>
  );

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p="4"
      height="550px"
      display="flex"
      flexDirection="column"
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Transações
      </Text>
      {isLoading && displayedTransactions.length === 0 ? (
        <VStack spacing={2} align="stretch" flex={1}>
          {Array.from({ length: 7 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <TransactionSkeleton key={index} />
          ))}
        </VStack>
      ) : displayedTransactions.length === 0 ? (
        <NoDataFound />
      ) : (
        <VStack spacing={2} align="stretch" flex={1} overflowY="auto">
          {displayedTransactions.map((transaction, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <TransactionItem key={index} transaction={transaction} />
          ))}
          {isLoading && <TransactionSkeleton />}
          <Box ref={observerTarget} height="1px" />
        </VStack>
      )}
    </Box>
  );
}
