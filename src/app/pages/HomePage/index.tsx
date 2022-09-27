import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { getStudents, postStudent } from "../../redux/slices/students/studentsSlice";
import { getNationalities } from "../../redux/slices/nationality/nationalitySlice";
import { transformStudentList } from "../../utils/helper";
import { TableRow } from "../../interfaces";

import {
  Nationality,
  NationalityList,
  Student,
  StudentList,
} from "../../redux/types";

import { ListTable, NewStudent, } from "../../components";

// TEMP:
import {
  LIST_TABLE_HEADERS,
  COLORS,
} from "../../mocks/data/app";

export function HomePage() {

  const [tableContent, setTableContent] = useState<TableRow[]>([]);

  const students: Array<Student> = useSelector(
    (state: { studentsReducer: StudentList }) => state.studentsReducer.students
  );
  const studentsLoadedError: boolean = useSelector(
    (state: { studentsReducer: StudentList }) => state.studentsReducer.hasError
  );
  const nationalities: Array<Nationality> = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.nationalities
  );
  const nationalitiesLoadedError: boolean = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.hasError
  );

  const dispatch = useDispatch<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(effect, []);
  };

  useEffectOnMount(() => {

    if (students.length <= 0 && !studentsLoadedError) {
      dispatch(getStudents());
    }

    if (nationalities.length <= 0 && !nationalitiesLoadedError) {
      dispatch(getNationalities());
    }

  });

  useEffect(() => {
    setTableContent(transformStudentList(students));
  }, [students]);

  return (
    <>
      <Wrapper>
        <HeaderWrapper>
          <Header>Student List</Header>
          <Button
            backgroundColor={COLORS.appPrimary}
            color={COLORS.white}
            letterSpacing={1}
            _hover={{ bg: COLORS.black }}
            onClick={onOpen}
          >
            ADD NEW STUDENT
          </Button>
        </HeaderWrapper>
        <ListTable
          tableContent={{
            rowData: tableContent,
            headersData: LIST_TABLE_HEADERS,
          }}
          colorScheme="gray"
        />
       
       <NewStudent 
        isOpen={isOpen}
        onClose={onClose}
       />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  margin-top: 40px;
  padding: 2em;
`;

const HeaderWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
`;

const Header = styled.h4`
  font-size: 24px;
  font-weight: bolder;
  letter-spacing: 1px;
`;
