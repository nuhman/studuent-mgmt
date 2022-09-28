import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

// Models
import { Student } from "../../redux/types";

// Components
import { StudentForm } from "../StudentForm";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: Student | {};
}

export function StudentModal({
  isOpen,
  onClose,
  studentInfo,
}: StudentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={"70vw"}>
        <ModalHeader>Student Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StudentForm studentInfo={studentInfo} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
