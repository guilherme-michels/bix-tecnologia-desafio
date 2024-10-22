import { Box, Circle, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  parse,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface MoneyFlowProps {
  data?: {
    date: number;
    deposits: number;
    withdrawals: number;
  }[];
}

export function MoneyFlow({ data = [] }: MoneyFlowProps) {
  const searchParams = useSearchParams();
  const startDateParam = searchParams?.get("startDate");
  const endDateParam = searchParams?.get("endDate");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const parseDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return parse(dateString, "dd/MM/yyyy", new Date());
    } catch {
      return null;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatDateShort = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd/MM/yy");
  };

  const startDate =
    parseDate(startDateParam) || new Date(new Date().getFullYear(), 0, 1);
  const endDate = parseDate(endDateParam) || new Date();

  const getDescription = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    if (isMobile) {
      return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
    }
    return `Período de ${formatDate(startDate)} a ${formatDate(endDate)}`;
  };

  const chartData = useMemo(() => {
    const daysDiff = differenceInDays(endDate, startDate);
    let interval: Date[];
    let formatString: string;

    if (daysDiff <= 31) {
      interval = eachDayOfInterval({ start: startDate, end: endDate });
      formatString = "dd/MM";
    } else if (daysDiff <= 90) {
      interval = eachWeekOfInterval({ start: startDate, end: endDate });
      formatString = "'Semana' w";
    } else {
      interval = eachMonthOfInterval({ start: startDate, end: endDate });
      formatString = "MMM yyyy";
    }

    const emptyData = interval.map((date) => ({
      date: format(date, formatString, { locale: ptBR }),
      deposits: 0,
      withdrawals: 0,
    }));

    if (data.length === 0) return emptyData;

    return emptyData.map((emptyItem) => {
      const matchingData = data.filter((d) => {
        return (
          format(new Date(d.date), formatString, { locale: ptBR }) ===
          emptyItem.date
        );
      });

      if (matchingData.length > 0) {
        return {
          date: emptyItem.date,
          deposits: matchingData.reduce((sum, d) => sum + d.deposits, 0),
          withdrawals: matchingData.reduce((sum, d) => sum + d.withdrawals, 0),
        };
      }
      return emptyItem;
    });
  }, [data, startDate, endDate]);

  const customTickFormatter = (tick: string) => {
    if (
      tick === chartData[0].date ||
      tick === chartData[chartData.length - 1].date
    ) {
      return tick;
    }
    return tick;
  };

  const chartHeight = useBreakpointValue({ base: 300, md: 400 });

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={{ base: 4, md: 6 }}
      height={{ base: "auto", md: "550px" }}
      bg="white"
      boxShadow="sm"
      overflow="hidden"
      width="100%"
    >
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        mb={{ base: 2, md: 6 }}
        flexDirection={{ base: "column", sm: "row" }}
      >
        <VStack align="start" spacing={0} mb={{ base: 2, sm: 0 }}>
          <Text
            fontSize={{ base: "xl", md: "xl", lg: "2xl" }}
            fontWeight="bold"
          >
            Fluxo Monetário
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
            {getDescription()}
          </Text>
        </VStack>
        <HStack
          spacing={4}
          flexWrap="wrap"
          justifyContent={{ base: "flex-start", sm: "flex-end" }}
        >
          <HStack>
            <Circle size={{ base: "8px", md: "10px" }} bg="#48BB78" />
            <Text fontSize={{ base: "xs", md: "sm" }} color="#48BB78">
              Receitas
            </Text>
          </HStack>
          <HStack>
            <Circle size={{ base: "8px", md: "10px" }} bg="#F56565" />
            <Text fontSize={{ base: "xs", md: "sm" }} color="#F56565">
              Despesas
            </Text>
          </HStack>
        </HStack>
      </Flex>
      <Box width="100%" height={chartHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              dy={10}
              tickFormatter={customTickFormatter}
              interval="preserveStartEnd"
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value as number),
                name,
              ]}
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#48BB78"
              strokeWidth={4}
              dot={false}
              name="Receitas"
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#F56565"
              strokeWidth={4}
              dot={false}
              name="Despesas"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      {chartData.length === 0 && (
        <Text textAlign="center" color="gray.500" mt={4}>
          Nenhum dado disponível para o período selecionado.
        </Text>
      )}
    </Box>
  );
}
