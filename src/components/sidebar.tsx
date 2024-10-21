"use client";

import { Box, Flex, Icon, Spacer, Text, VStack } from "@chakra-ui/react";
import {
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiPieChart,
  FiSettings,
} from "react-icons/fi";
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
  const handleMyAccount = () => {
    console.log("Indo para Minha conta");
  };

  const handleLogout = () => {
    console.log("Deslogando");
  };

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
      borderRight="1px"
      borderRightColor="blackAlpha.100"
      w="60"
    >
      <VStack spacing="8" align="stretch" h="full">
        <Box px="4" pt="8">
          <Text fontSize="2xl" fontWeight="medium" textAlign="center">
            Bix Money
          </Text>
        </Box>

        <Box px={2}>
          <UserCard
            name="John Doe"
            email="john@example.com"
            avatarUrl="https://bit.ly/dan-abramov"
            onMyAccount={handleMyAccount}
            onLogout={handleLogout}
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
