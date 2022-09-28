import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

// Components
import { NewForm } from "./NewForm";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewStudent({ isOpen, onClose }: StudentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={"70vw"}>
        <ModalHeader>Student Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <NewForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
