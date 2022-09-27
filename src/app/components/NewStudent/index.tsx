import React from "react";
import styled from "styled-components/macro";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { NewForm } from "./NewForm";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
} 

export function NewStudent({ isOpen, onClose, }: StudentModalProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={'70vw'}>
        <ModalHeader>Student Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <NewForm 

          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
