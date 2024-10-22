"use client";

import { Box, ChakraProvider } from "@chakra-ui/react";
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
          <Box h="100vh" overflowY="auto">
            {children}
          </Box>
        </ChakraProvider>
      </body>
    </html>
  );
}
