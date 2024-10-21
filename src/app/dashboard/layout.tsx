"use client";

import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" ml="60" p="6" overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
