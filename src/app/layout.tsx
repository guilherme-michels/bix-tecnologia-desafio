"use client";

import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import "../global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ChakraProvider>
          <Flex h="100vh">
            <Sidebar />
            <Box flex="1" ml="4" overflowY="auto">
              {children}
            </Box>
          </Flex>
        </ChakraProvider>
      </body>
    </html>
  );
}
