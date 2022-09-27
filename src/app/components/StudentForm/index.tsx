import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { FamilyMember, Nationality, NationalityList, Student, StudentList } from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import { get as _get } from "lodash";
import { deleteStudentFamily, putStudent } from "../../redux/slices/students/studentsSlice";

export function StudentForm({
  studentInfo,
  onClose,
}: {
  studentInfo: any;
  onClose: () => void;
}) {
  const [student, setStudent] = useState<Student>({
    ID: studentInfo.ID,
    firstName: studentInfo.firstName,
    lastName: studentInfo.lastName,
    country: studentInfo.country,
    nationality: studentInfo.nationality,
    dateOfBirth:
      studentInfo.dateOfBirth && studentInfo.dateOfBirth.split("T")[0],
    familyMembers: studentInfo.familyMembers,
  });

  const dispatch = useDispatch<any>();

  const [studentNationality, setStudentNationality] = useState(
    studentInfo.nationality
  );

  const [familyInfo, setFamilyInfo] = useState(student.familyMembers);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  const [newFamilyInfo, setNewFamilyInfo] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: Nationality | undefined;
    country?: string;
    relation: string;
    relationship: string;
  }>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: undefined,
    country: "",
    relation: "",
    relationship: "",
  });

  const nationalities: Array<Nationality> = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.nationalities
  );
  const nationalitiesLoadedError: boolean = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.hasError
  );

  const students: Array<Student> = useSelector(
    (state: { studentsReducer: StudentList }) => state.studentsReducer.students
  );

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    const _student = students.find(std => std.ID == studentInfo.ID);
    console.log("DXD: _student: ", _student);
    if (_student) {
        setStudent(_student);
        setFamilyInfo(_student.familyMembers);
    }
  }, [students, studentInfo.ID]);

  function validateName(value: string) {
    return;
  }

  const handleStudentNationalityChange = (e: any) => {
    const _nation = (nationalities || []).find(
      (n) => `${n.ID}` === e.target.value
    );
    setStudentNationality(_nation);
  };

  const handleFamilyNationalityChange = (e: any, memberId: Number) => {
    const _familyInfo = (familyInfo || []).map((info) => {
      console.log(info.ID, memberId);
      if (info.ID === memberId) {
        const _nation = (nationalities || []).find(
          (n) => `${n.ID}` === e.target.value
        );
        return {
          ...info,
          nationality: _nation || info.nationality,
          country: _nation?.Title,
        };
      }
      return info;
    });

    setFamilyInfo(_familyInfo);
  };

  const handleFamilyRelationChange = (e: any, memberId: Number) => {
    const _familyInfo = (familyInfo || []).map((info) => {
      if (info.ID === memberId) {
        return {
          ...info,
          relationship: e.target.value,
          relation: e.target.value,
        };
      }

      return info;
    });

    setFamilyInfo(_familyInfo);
  };

  const handleFamilyNameChange = (
    e: any,
    memberId: Number,
    isLastName?: boolean
  ) => {
    console.log(e.target.value);
    const _familyInfo = (familyInfo || []).map((info) => {
      console.log(info.ID, memberId, "DXD");
      if (info.ID === memberId) {
        return {
          ...info,
          firstName: isLastName ? info.firstName : e.target.value,
          lastName: isLastName ? e.target.value : info.lastName,
        };
      }

      return info;
    });

    setFamilyInfo(_familyInfo);
  };

  const handleNewFamilyNationalityChange = (e: any) => {
    const _nation = (nationalities || []).find(
      (n) => `${n.ID}` === e.target.value
    );

    setNewFamilyInfo({
      ...newFamilyInfo,
      nationality: _nation,
      country: _nation?.Title,
    });
  };

  const handleNewFamilyRelationChange = (e: any) => {
    setNewFamilyInfo({
      ...newFamilyInfo,
      relationship: e.target.value,
      relation: e.target.value,
    });
  };

  const handleFamilyDelete = (e: any, _std: Student, member: FamilyMember) => {
    dispatch(deleteStudentFamily({
        studentID: _std.ID,
        memberID: member.ID,
        student: _std,
    }));
  }

  const renderFormField = (
    name: string,
    label: string,
    validateFn: Function,
    type: string,
    options?: any
  ) => {
    return (
      <Field name={name} validate={validateFn}>
        {({ field, form }: any) => {
          return (
            <FormControl
              isInvalid={form.errors[name] && form.touched[name]}
              style={{ marginBottom: "20px" }}
            >
              <FormLabel>{label}</FormLabel>
              <Input {...field} placeholder={label} type={type} />
              <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>
          );
        }}
      </Field>
    );
  };

  return (
    <Wrapper>
      <Formik
        initialValues={{
          ...student,
          newMember: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
          },
        }}
        onSubmit={(values, actions) => {
          values.familyMembers = familyInfo;
          values.nationality = studentNationality;
          values.country = studentNationality?.Title;
          values.newMember = {
            ...newFamilyInfo,
            ...values.newMember,
          };

          let isMissingValue = false;
          (values.familyMembers || []).forEach((mem) => {
            if (!mem.firstName || !mem.lastName || !mem.dateOfBirth) {
              isMissingValue = true;
            }
          });

          if (!values.firstName || !values.lastName || !values.dateOfBirth) {
            isMissingValue = true;
          }

          if (
            (showAddMemberForm && (!values.newMember ||
            !values.newMember.firstName ||
            !values.newMember.lastName ||
            !values.dateOfBirth)) ||
            isMissingValue
          ) {
            actions.setSubmitting(false);
            alert("Please provide all necessary details!");
            return;
          }

          dispatch(putStudent(values));

          setTimeout(() => {
            console.log(values);
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(props) => (
          <Form style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flex: "0 0 50%",
                padding: "20px",
                borderBottom: "2px dotted darkgrey",
              }}
            >
              <div style={{ flex: "0 0 50%", padding: "10px" }}>
                {renderFormField(
                  "firstName",
                  "First Name",
                  validateName,
                  "text"
                )}
                {renderFormField(
                  "dateOfBirth",
                  "Date of Birth",
                  validateName,
                  "date"
                )}
              </div>

              <div style={{ flex: "0 0 50%", padding: "10px" }}>
                {renderFormField("lastName", "Last Name", validateName, "text")}

                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Select
                    defaultValue={student.nationality?.ID}
                    value={studentNationality?.ID}
                    onChange={handleStudentNationalityChange}
                  >
                    {nationalities.map((n) => (
                      <option key={n.ID} value={n.ID}>
                        {n.Title}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Family Members Section  */}

            <div style={{ padding: "20px" }}>
              <p
                style={{
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                Family Members
              </p>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    flex: "0 0 50%",
                    padding: "10px",
                    borderRight: "2px dotted darkgrey",
                  }}
                >
                  {student?.familyMembers?.map((member, index) => {
                    return (
                      <div
                        style={{
                          boxShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                          padding: "15px",
                          borderRadius: "20px",
                          marginBottom: "20px",
                        }}
                      >
                        <FormControl>
                          <FormLabel>First Name</FormLabel>
                          <Input
                            type="text"
                            value={familyInfo && familyInfo[index]?.firstName}
                            onChange={(e) =>
                              handleFamilyNameChange(e, member.ID)
                            }
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            type="text"
                            value={familyInfo && familyInfo[index]?.lastName}
                            onChange={(e) =>
                              handleFamilyNameChange(e, member.ID, true)
                            }
                          />
                        </FormControl>

                        <FormControl style={{ marginBottom: "20px" }}>
                          <FormLabel>Country</FormLabel>
                          <Select
                            defaultValue={member.nationality?.ID}
                            value={
                              familyInfo && familyInfo[index]?.nationality?.ID
                            }
                            onChange={(e) =>
                              handleFamilyNationalityChange(e, member.ID)
                            }
                          >
                            {nationalities.map((n) => (
                              <option key={n.ID} value={n.ID}>
                                {n.Title}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Relation</FormLabel>
                          <Select
                            defaultValue={member.relationship}
                            value={familyInfo && familyInfo[index]?.relationship}
                            onChange={(e) =>
                              handleFamilyRelationChange(e, member.ID)
                            }
                          >
                            {["Parent", "Sibling", "Spouse"].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <Button
                            mt={4}
                            mb={4}
                            onClick={(e) => handleFamilyDelete(e, student, member)}
                            backgroundColor={"#e74c3c"}
                            color={"#f5f5f5"}
                        >Delete Member</Button> 

                      </div>
                    );
                  })}

                  { (!student?.familyMembers || student.familyMembers.length <= 0) && (
                    <p>No Family Members added yet!</p>
                  ) }
                </div>

                <div style={{ flex: "0 0 50%", padding: "10px" }}>
                  {showAddMemberForm && (
                    <div>
                      {renderFormField(
                        "newMember.firstName",
                        "First Name",
                        validateName,
                        "text"
                      )}

                      {renderFormField(
                        "newMember.lastName",
                        "Last Name",
                        validateName,
                        "text"
                      )}

                      {renderFormField(
                        "newMember.dateOfBirth",
                        "Date of Birth",
                        validateName,
                        "date"
                      )}

                      <FormControl style={{ marginBottom: "20px" }}>
                        <FormLabel>Country</FormLabel>
                        <Select
                          defaultValue={nationalities && nationalities[0].ID}
                          value={newFamilyInfo.nationality?.ID}
                          onChange={(e) => handleNewFamilyNationalityChange(e)}
                        >
                          {nationalities.map((n) => (
                            <option key={n.ID} value={n.ID}>
                              {n.Title}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Relation</FormLabel>
                        <Select
                          defaultValue={"Parent"}
                          value={newFamilyInfo.relationship || "Parent"}
                          onChange={(e) => handleNewFamilyRelationChange(e)}
                        >
                          {["Parent", "Sibling", "Spouse"].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}
                  <Button
                    colorScheme="blue"
                    mt={showAddMemberForm ? 6 : 3}
                    onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  >
                    {showAddMemberForm
                      ? "Cancel Adding Member"
                      : "Add Family Member"}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Button
                mt={12}
                mb={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
                maxWidth={"30%"}
              >
                SAVE 
              </Button>
              <Button
                mt={12}
                ml={6}
                mb={4}
                maxWidth={"30%"}
                onClick={onClose}
                backgroundColor={"#EDF2F"}
              >
                CANCEL
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 5px;
`;
