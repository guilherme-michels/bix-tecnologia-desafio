"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { Toaster } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Flex minHeight="100vh" width="full">
      <Toaster position="top-right" />
      {/* Lado esquerdo - Imagem */}
      <Box flex={1} position="relative" display={{ base: "none", md: "block" }}>
        <Image
          src="/login-image.jpg"
          alt="Login"
          layout="fill"
          objectFit="cover"
        />
      </Box>

      {/* Lado direito - Formulário de login */}
      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        bg={bgColor}
        p={8}
      >
        <Box width="full" maxWidth="400px">
          <Box textAlign="center" mb={8}>
            <Heading size="xl">Bem-vindo ao Bix Money</Heading>
            <Text mt={2} color={textColor}>
              Entre para gerenciar suas finanças
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>
              {error && <Text color="red.500">{error}</Text>}
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                size="lg"
                isLoading={isLoggingIn}
                loadingText="Entrando..."
              >
                Entrar
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
}
