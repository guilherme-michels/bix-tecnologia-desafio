"use client";

import { Box, Flex, Icon, Spacer, Text, VStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { FiHome } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import UserCard from "./user-card";

const SidebarItem = ({
  icon,
  children,
  isActive,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
}) => (
  <Flex
    align="center"
    p="2"
    mx="2"
    borderRadius="lg"
    as="fieldset"
    cursor="pointer"
    bg={isActive ? "blackAlpha.200" : "transparent"}
    _hover={{
      bg: isActive ? "blackAlpha.300" : "blackAlpha.100",
    }}
    transition="all 0.2s"
  >
    <Icon mr="4" fontSize="14" as={icon} />
    <Text fontSize="14">{children}</Text>
  </Flex>
);

export default function Sidebar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  const isDashboardActive = pathname && pathname.startsWith("/dashboard");

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
          <UserCard name={user?.name || ""} isLoading={loading} />
        </Box>

        <VStack spacing="1" align="stretch">
          <SidebarItem icon={FiHome} isActive={!!isDashboardActive}>
            Dashboard
          </SidebarItem>
        </VStack>

        <Spacer />
      </VStack>
    </Box>
  );
}
