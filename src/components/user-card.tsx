"use client";

import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FiLogOut, FiUser } from "react-icons/fi";

interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onMyAccount: () => void;
  onLogout: () => void;
}

export default function UserCard({
  name,
  email,
  avatarUrl,
  onMyAccount,
  onLogout,
}: UserCardProps) {
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
          >
            <Flex
              align="center"
              p="2"
              bg={isOpen ? "blackAlpha.100" : "transparent"}
            >
              <Avatar size="sm" name={name} src={avatarUrl} mr="3" />
              <Box flex="1">
                <Text fontWeight="medium">{name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {email}
                </Text>
              </Box>
            </Flex>
          </MenuButton>
          <Portal>
            <MenuList zIndex={9999} minW="100px" p={0}>
              <MenuItem icon={<FiUser />} onClick={onMyAccount} fontSize={13}>
                Minha conta
              </MenuItem>
              <MenuItem
                icon={<FiLogOut />}
                onClick={onLogout}
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
