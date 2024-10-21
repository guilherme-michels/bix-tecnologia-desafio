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
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { DepositsAndWithdrawals } from "./deposits-and-withdrawals";
import { RecentTransactions } from "./recent-transactions";

import transactionsData from "@/transactions.json";

const chartData = [
  { month: "Jan", deposits: 4000, withdrawals: 2400 },
  { month: "Fev", deposits: 3000, withdrawals: 1398 },
  { month: "Mar", deposits: 2000, withdrawals: 9800 },
  { month: "Abr", deposits: 2780, withdrawals: 3908 },
  { month: "Mai", deposits: 1890, withdrawals: 4800 },
  { month: "Jun", deposits: 2390, withdrawals: 3800 },
];

export function Overview() {
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
          <StatNumber>R$ 5.670,00</StatNumber>
          <StatHelpText>Atualizado há 5 minutos</StatHelpText>
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
          <StatLabel>Receitas (este mês)</StatLabel>
          <StatNumber>R$ 3.200,00</StatNumber>
          <StatHelpText>+15% em relação ao mês passado</StatHelpText>
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
          <StatLabel>Despesas (este mês)</StatLabel>
          <StatNumber>R$ 2.100,00</StatNumber>
          <StatHelpText>-5% em relação ao mês passado</StatHelpText>
        </Stat>
      </SimpleGrid>
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <DepositsAndWithdrawals data={chartData} />
        </GridItem>
        <GridItem>
          <RecentTransactions transactions={transactionsData} />
        </GridItem>
      </Grid>
    </Box>
  );
}
