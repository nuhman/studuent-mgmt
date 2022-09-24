import React from "react";
import styled from "styled-components/macro";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentModal({ isOpen, onClose }: StudentModalProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>akjsdqwkqe qwjkeqwe qwjke</p>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
