import { Box, Circle, Flex, HStack, Text, VStack } from "@chakra-ui/react";
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

  const startDate =
    parseDate(startDateParam) || new Date(new Date().getFullYear(), 0, 1);
  const endDate = parseDate(endDateParam) || new Date();

  const getDescription = () => {
    return `Fluxo monetário do período de ${formatDate(startDate)} a ${formatDate(endDate)}`;
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
        const itemDate = parse(emptyItem.date, formatString, new Date(), {
          locale: ptBR,
        });
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

  return (
    <Box
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p="6"
      height="100%"
      bg="white"
      boxShadow="sm"
    >
      <Flex justifyContent="space-between" alignItems="flex-start" mb={6}>
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="bold">
            Fluxo Monetário
          </Text>
          <Text fontSize="sm" color="gray.600">
            {getDescription()}
          </Text>
        </VStack>
        <HStack spacing={4}>
          <HStack>
            <Circle size="10px" bg="#48BB78" />
            <Text fontSize="sm" color="#48BB78">
              Receitas
            </Text>
          </HStack>
          <HStack>
            <Circle size="10px" bg="#F56565" />
            <Text fontSize="sm" color="#F56565">
              Despesas
            </Text>
          </HStack>
        </HStack>
      </Flex>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 40,
            left: 20,
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
            formatter={(value, name) => [formatCurrency(value as number), name]}
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
      {chartData.length === 0 && (
        <Text textAlign="center" color="gray.500" mt={4}>
          Nenhum dado disponível para o período selecionado.
        </Text>
      )}
    </Box>
  );
}
