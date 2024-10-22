import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiDollarSign,
} from "react-icons/fi";

import {
  Box,
  Grid,
  GridItem,
  Icon,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useTransactions } from "../../../hooks/useTransactions";
import { MoneyFlow } from "./money-flow";
import { TransactionsListCard } from "./transactions-list-card";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function Overview() {
  const {
    displayedTransactions,
    isLoading,
    loadMoreTransactions,
    hasMoreTransactions,
    dashboardData,
    moneyFlowData,
  } = useTransactions(true);

  const formatValue = useCallback((value: number | null) => {
    return value !== null ? formatCurrency(value) : "";
  }, []);

  const statFontSize = useBreakpointValue({ base: "sm", md: "md", lg: "2xl" });
  const iconSize = useBreakpointValue({ base: "3", md: "4" });
  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    md: "1fr 1fr",
    lg: "2fr 1fr",
  });

  return (
    <Box maxWidth="100%" overflow="hidden">
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 4, md: 6 }}
        mb={{ base: 6, md: 8 }}
      >
        <Stat
          position="relative"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p={{ base: 3, md: 4 }}
        >
          <Box
            position="absolute"
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
          >
            <Icon as={FiDollarSign} boxSize={iconSize} />
          </Box>
          <StatLabel fontSize={"sm"}>Saldo Total</StatLabel>
          <Skeleton
            isLoaded={!isLoading}
            height={{ base: "24px", md: "36px" }}
            startColor="blackAlpha.100"
            endColor="blackAlpha.200"
          >
            <StatNumber fontSize={statFontSize}>
              {formatValue(dashboardData.totalBalance)}
            </StatNumber>
          </Skeleton>
        </Stat>
        <Stat
          position="relative"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p={{ base: 3, md: 4 }}
        >
          <Box
            position="absolute"
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
          >
            <Icon as={FiArrowUpCircle} boxSize={iconSize} />
          </Box>
          <StatLabel fontSize={"sm"}>Receitas</StatLabel>
          <Skeleton
            isLoaded={!isLoading}
            height={{ base: "24px", md: "36px" }}
            startColor="blackAlpha.100"
            endColor="blackAlpha.200"
          >
            <StatNumber fontSize={statFontSize}>
              {formatValue(dashboardData.income)}
            </StatNumber>
          </Skeleton>
        </Stat>
        <Stat
          position="relative"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p={{ base: 3, md: 4 }}
        >
          <Box
            position="absolute"
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
          >
            <Icon as={FiArrowDownCircle} boxSize={iconSize} />
          </Box>
          <StatLabel fontSize={"sm"}>Despesas</StatLabel>
          <Skeleton
            isLoaded={!isLoading}
            height={{ base: "24px", md: "36px" }}
            startColor="blackAlpha.100"
            endColor="blackAlpha.200"
          >
            <StatNumber fontSize={statFontSize}>
              {formatValue(dashboardData.expenses)}
            </StatNumber>
          </Skeleton>
        </Stat>
      </SimpleGrid>
      <Grid
        templateColumns={gridTemplateColumns}
        gap={{ base: 4, md: 6 }}
        width="100%"
      >
        <GridItem width="100%">
          <MoneyFlow data={moneyFlowData} />
        </GridItem>
        <GridItem width="100%">
          <TransactionsListCard
            transactions={displayedTransactions}
            isLoading={isLoading}
            loadMoreTransactions={loadMoreTransactions}
            hasMoreTransactions={hasMoreTransactions}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}
