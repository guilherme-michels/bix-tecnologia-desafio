"use client";

import { Box, Flex, Icon, Spacer, Text, VStack } from "@chakra-ui/react";
import { FiDollarSign, FiHome, FiPieChart } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import UserCard from "./user-card";

const SidebarItem = ({
  icon,
  children,
}: { icon: React.ElementType; children: React.ReactNode }) => (
  <Flex
    align="center"
    p="2"
    mx="2"
    borderRadius="sm"
    as="fieldset"
    cursor="pointer"
    _hover={{
      bg: "blackAlpha.100",
    }}
    transition="all 0.2s"
  >
    <Icon mr="4" fontSize="14" as={icon} />
    <Text fontSize="14">{children}</Text>
  </Flex>
);

export default function Sidebar() {
  const { user, logout, loading } = useAuth();

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      borderColor="gray.200"
      borderRightWidth="1px"
      w="60"
    >
      <VStack spacing={4} align="stretch" p={4}>
        <Box px="4" pt="8">
          <Text fontSize="2xl" fontWeight="medium" textAlign="center">
            Bix Money
          </Text>
        </Box>

        <Box>
          <UserCard
            name={user?.name || ""}
            email={user?.email || ""}
            onMyAccount={() => console.log("Indo para Minha conta")}
            onLogout={logout}
            isLoading={loading}
          />
        </Box>

        <VStack spacing="1" align="stretch">
          <SidebarItem icon={FiHome}>Dashboard</SidebarItem>
          <SidebarItem icon={FiDollarSign}>Transações</SidebarItem>
          <SidebarItem icon={FiPieChart}>Relatórios</SidebarItem>
        </VStack>

        <Spacer />
      </VStack>
    </Box>
  );
}
