"use client";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  Spacer,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
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

export default function Sidebar({
  isOpen,
  onClose,
}: { isOpen: boolean; onClose: () => void }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isDashboardActive = pathname?.startsWith("/dashboard");
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const SidebarContent = (
    <VStack spacing={4} align="stretch">
      <Box
        py={4}
        px={4}
        bg="blue.500"
        boxShadow="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="md" color="white" textAlign="center">
          Bix Money
        </Heading>
      </Box>

      <Box px={4}>
        <UserCard name={user?.name || ""} isLoading={loading} />
      </Box>

      <VStack spacing="1" align="stretch" px={3}>
        <SidebarItem icon={FiHome} isActive={!!isDashboardActive}>
          Dashboard
        </SidebarItem>
      </VStack>

      <Spacer />
    </VStack>
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody p={0}>{SidebarContent}</DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }

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
      display={{ base: "none", lg: "block" }}
    >
      {SidebarContent}
    </Box>
  );
}
