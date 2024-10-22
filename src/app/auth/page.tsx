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
import { Toaster, toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      toast.error("Credenciais inválidas");
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const boxBgColor = useColorModeValue("white", "gray.700");

  return (
    <Flex minHeight="100vh" width="full">
      <Toaster position="top-right" />
      <Flex
        flex={1}
        position="relative"
        display={{ base: "none", md: "flex" }}
        bg="blue.500"
        alignItems="center"
        justifyContent="center"
      >
        <Box position="absolute" top={4} left={4} zIndex={1}>
          <Heading size="md" color="white">
            Bix Money
          </Heading>
        </Box>
        <Box position="relative" width="300px" height="300px">
          <Image
            src="/financial-icon.png"
            alt="Finanças e Negócios"
            layout="fill"
            objectFit="contain"
            quality={100}
          />
        </Box>
      </Flex>

      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        bg={bgColor}
        p={8}
      >
        <Box
          width="full"
          maxWidth="400px"
          bg={boxBgColor}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
        >
          <Box mb={8}>
            <Heading size="xl">Bem-vindo de volta</Heading>
            <Text mt={2} color={textColor}>
              Gerenciando finanças para um futuro próspero!
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
                  bg={useColorModeValue("gray.100", "gray.600")}
                  border="none"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  bg={useColorModeValue("gray.100", "gray.600")}
                  border="none"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                size="lg"
                isLoading={loading}
                loadingText="Entrando..."
                mt={4}
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
