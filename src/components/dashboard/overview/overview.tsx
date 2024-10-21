import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiDollarSign,
} from "react-icons/fi";

import type { Transaction } from "@/types/dashboard";
import {
  Box,
  Grid,
  GridItem,
  Icon,
  SimpleGrid,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { MoneyFlow } from "./money-flow";
import { RecentTransactions } from "./recent-transactions";

interface OverviewProps {
  transactions: Transaction[];
  isLoading: boolean;
  onLoadMore: () => void;
  dashboardData: {
    totalBalance: number;
    income: number;
    expenses: number;
  };
  moneyFlowData: {
    month: string;
    deposits: number;
    withdrawals: number;
  }[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function Overview({
  transactions,
  isLoading,
  onLoadMore,
  dashboardData,
  moneyFlowData,
}: OverviewProps) {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" mb="8">
        <Stat
          position="relative"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p="4"
        >
          <Box position="absolute" top="4" right="4">
            <Icon as={FiDollarSign} boxSize="4" />
          </Box>
          <StatLabel>Saldo Total</StatLabel>
          <Skeleton
            isLoaded={!isLoading}
            height="36px"
            startColor="blackAlpha.100"
            endColor="blackAlpha.200"
          >
            <StatNumber>
              {formatCurrency(dashboardData.totalBalance)}
            </StatNumber>
          </Skeleton>
        </Stat>
        <Stat
          position="relative"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p="4"
        >
          <Box position="absolute" top="4" right="4">
            <Icon as={FiArrowUpCircle} boxSize="4" />
          </Box>
          <StatLabel>Receitas</StatLabel>
          <Skeleton
            isLoaded={!isLoading}
            height="36px"
            startColor="blackAlpha.100"
            endColor="blackAlpha.200"
          >
            <StatNumber>{formatCurrency(dashboardData.income)}</StatNumber>
          </Skeleton>
        </Stat>
        <Stat
          position="relative"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p="4"
        >
          <Box position="absolute" top="4" right="4">
            <Icon as={FiArrowDownCircle} boxSize="4" />
          </Box>
          <StatLabel>Despesas</StatLabel>
          <Skeleton
            isLoaded={!isLoading}
            height="36px"
            startColor="blackAlpha.100"
            endColor="blackAlpha.200"
          >
            <StatNumber>{formatCurrency(dashboardData.expenses)}</StatNumber>
          </Skeleton>
        </Stat>
      </SimpleGrid>
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <MoneyFlow data={moneyFlowData} />
        </GridItem>
        <GridItem>
          <RecentTransactions
            transactions={transactions}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}
