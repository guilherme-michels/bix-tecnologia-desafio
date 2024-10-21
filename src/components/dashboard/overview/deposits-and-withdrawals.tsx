import { Box, Text } from "@chakra-ui/react";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DepositsAndWithdrawalsProps {
  data: {
    month: string;
    deposits: number;
    withdrawals: number;
  }[];
}

export function DepositsAndWithdrawals({ data }: DepositsAndWithdrawalsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Entradas e Saídas
      </Text>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 40,
            left: 60,
            bottom: 5,
          }}
        >
          <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCurrency}
            dx={0}
          />
          <Tooltip
            formatter={formatCurrency}
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="deposits"
            fill="#48BB78"
            radius={[4, 4, 0, 0]}
            name="Entradas"
          />
          <Bar
            dataKey="withdrawals"
            fill="#F56565"
            radius={[4, 4, 0, 0]}
            name="Saídas"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
