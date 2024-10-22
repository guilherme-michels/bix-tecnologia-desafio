"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Center,
  Flex,
  IconButton,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.replace("/auth");
      }
      setIsChecking(false);
    };

    if (!loading) {
      verifyAuth();
    }
  }, [loading, checkAuth, router]);

  if (loading || isChecking) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Flex h="100vh">
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box flex="1" ml={{ base: 0, lg: "60" }} transition="margin-left 0.3s">
        <Flex
          mt={2}
          ml={2}
          alignItems="center"
          display={{ base: "flex", lg: "none" }}
        >
          <IconButton
            aria-label="Abrir menu"
            icon={<FiMenu />}
            onClick={onOpen}
          />
        </Flex>
        <Box py={2} px={4} overflowY="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
