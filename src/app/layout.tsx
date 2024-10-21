"use client";

import { Box, ChakraProvider } from "@chakra-ui/react";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <Box h="100vh" overflowY="auto">
              {children}
            </Box>
          </QueryClientProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
