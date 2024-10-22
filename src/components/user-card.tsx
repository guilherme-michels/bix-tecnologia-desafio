"use client";

import {
  Avatar,
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onMyAccount: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

export default function UserCard({
  name,
  email,
  avatarUrl,
  onMyAccount,
  onLogout,
  isLoading = false,
}: UserCardProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Menu placement="bottom-end" offset={[40, 0]}>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Box}
            w="100%"
            cursor="pointer"
            transition="background-color 0.2s"
            rounded="sm"
            border={"1px"}
            borderColor={"blackAlpha.100"}
            borderRadius={"lg"}
          >
            <Flex
              align="center"
              px="2"
              py={"3"}
              bg={isOpen ? "blackAlpha.100" : "transparent"}
            >
              {isLoading ? (
                <SkeletonCircle
                  size="8"
                  mr="3"
                  startColor="blackAlpha.100"
                  endColor="blackAlpha.200"
                />
              ) : (
                <Avatar size="sm" name={name} src={avatarUrl} mr="3" />
              )}
              <Box flex="1">
                {isLoading ? (
                  <Skeleton
                    height="16px"
                    width="100px"
                    startColor="blackAlpha.100"
                    endColor="blackAlpha.200"
                  />
                ) : (
                  <Text fontWeight="medium" fontSize={"xs"}>
                    {name}
                  </Text>
                )}
              </Box>
              <Icon
                as={FiChevronDown}
                ml={2}
                transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                transition="transform 0.2s"
              />
            </Flex>
          </MenuButton>
          <Portal>
            <MenuList zIndex={9999} minW="100px" p={0}>
              <MenuItem icon={<FiUser />} onClick={onMyAccount} fontSize={13}>
                Minha conta
              </MenuItem>
              <MenuItem
                icon={<FiLogOut />}
                onClick={handleLogout}
                fontSize={13}
                textColor={"red.600"}
              >
                Deslogar
              </MenuItem>
            </MenuList>
          </Portal>
        </>
      )}
    </Menu>
  );
}
