import * as React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure
} from '@chakra-ui/react';

import './index.css';
import { TableProps } from '../../interfaces';
import { StudentModal } from '../StudentModal';

export function ListTable({
  caption = 'Sample Table here ',
  tableContent,
  colorScheme = 'red',
}: TableProps) {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderTableHeader = () => {
    return tableContent.headersData.map((headerText, i) => (
      <Th key={`${headerText}-${i}`}>{headerText}</Th>
    ));
  };

  const renderTableContent = () => {
    return tableContent.rowData.map(tableRow => {
      return (
        <Tr key={tableRow.id} className='app-std-table-row' onClick={onOpen}>
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

  if (!tableContent || !tableContent.rowData || !tableContent.rowData.length)
    return <></>;

  return (
    <>
    <TableContainer style={styles.table.container}>
      <Table variant="striped" colorScheme={colorScheme}>
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>{renderTableHeader()}</Tr>
        </Thead>
        <Tbody>{renderTableContent()}</Tbody>
      </Table>
    </TableContainer>
    <StudentModal 
        isOpen={isOpen} 
        onClose={onClose}
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
