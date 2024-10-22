"use client";

import { useAuth } from "@/hooks/useAuth";
import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

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
      <Sidebar />
      <Box flex="1" ml="60" py={2} px={4} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
