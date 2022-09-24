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
import { Student } from "../../redux/types";
import { StudentForm } from '../StudentForm';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: Student | {};
}

export function StudentModal({ isOpen, onClose, studentInfo }: StudentModalProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={'70vw'}>
        <ModalHeader>Student Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StudentForm 
            studentInfo={studentInfo}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
