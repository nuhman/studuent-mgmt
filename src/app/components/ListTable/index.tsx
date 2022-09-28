import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import './index.css';

// Models
import { TableProps } from '../../interfaces';
import { StudentModal } from '../StudentModal';
import { Student, StudentList } from '../../redux/types';

export function ListTable({
  tableContent,
  colorScheme = 'red',
}: TableProps) {

  // Model state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Redux Store Selectors
  const students: Array<Student> = useSelector(
    (state: { studentsReducer: StudentList }) => state.studentsReducer.students
  );

  // Local state
  const [studentInfo, setStudentInfo] = useState<Student | {}>({});

  const handleModalOpen = (id: number | string) => { 
    // eslint-disable-next-line eqeqeq
    const student = students.find(std => std.ID == id);
    if (student) {
      setStudentInfo(student);
    }
    onOpen();
  }

  const renderTableHeader = () => {
    return tableContent.headersData.map((headerText, i) => (
      <Th key={`${headerText}-${i}`}>{headerText}</Th>
    ));
  };

  const renderTableContent = () => {
    return tableContent.rowData.map(tableRow => {
      return (
        <Tr key={tableRow.id} className='app-std-table-row' onClick={() => handleModalOpen(tableRow.id)}>
          {tableRow.values.map(tableColValue => {
            return (
              <Td key={`${tableRow.id}-${tableColValue}`} className='app-std-table-td'>
                {tableColValue}
              </Td>
            );
          })}
        </Tr>
      );
    });
  };

  // If no data present, return empty tag
  if (!tableContent || !tableContent.rowData || !tableContent.rowData.length)
    return <></>;

  return (
    <>
    <TableContainer style={styles.table.container}>
      <Table variant="striped" colorScheme={colorScheme}>
        <Thead>
          <Tr>{renderTableHeader()}</Tr>
        </Thead>
        <Tbody>{renderTableContent()}</Tbody>
      </Table>
    </TableContainer>


    <StudentModal 
        isOpen={isOpen} 
        onClose={onClose}
        studentInfo={studentInfo}
      />
    </>
  );
}

const styles = {
  table: {
    container: {
      borderRadius: '10px',
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    },
  },
};
