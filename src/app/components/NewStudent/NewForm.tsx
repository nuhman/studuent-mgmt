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
import { Nationality, NationalityList, Student } from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import { get as _get } from "lodash";
import { postStudent } from "../../redux/slices/students/studentsSlice";

export function NewForm({ onClose, }: { onClose: () => void; }) {
  const dispatch = useDispatch<any>();

  const [studentNationality, setStudentNationality] = useState<
    Nationality | undefined
  >();

  const [familyInfo, setFamilyInfo] = useState<
    {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      nationality: Nationality | undefined;
      country?: string;
      relation: string;
      relationship: string;
    }[]
  >([
    {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: undefined,
      country: "",
      relation: "",
      relationship: "",
    },
  ]);

  const nationalities: Array<Nationality> = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.nationalities
  );
  const nationalitiesLoadedError: boolean = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.hasError
  );

  useEffect(() => {
    setStudentNationality(nationalities && nationalities[0]);
  }, [nationalities]);

  function validateName(value: string) {
    return;
  }

  const handleStudentNationalityChange = (e: any) => {
    const _nation = (nationalities || []).find(
      (n) => `${n.ID}` === e.target.value
    );
    setStudentNationality(_nation);
  };

  const handleFamilyNationalityChange = (e: any, index: number)  => {
    const _familyInfo = (familyInfo || []).map((info, i) => {
        if (i === index) {
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
  }

  const handleFamilyRelationChange = (e: any, index: number) => {
    const _familyInfo = (familyInfo || []).map((info, i) => {
        if (i === index) {
          return {
            ...info,
            relationship: e.target.value,
            relation: e.target.value,
          };
        }
  
        return info;
      });
  
      setFamilyInfo(_familyInfo);
  }

  const handleFamilyNameChange = (e: any, index: Number, isLastName?: boolean) => {
    const _familyInfo = (familyInfo || []).map((info, i) => {
        if (i === index) {
          return {
            ...info,
            firstName: isLastName ? info.firstName : e.target.value,
            lastName: isLastName ? e.target.value : info.lastName,
          };
        }
  
        return info;
      });
  
      setFamilyInfo(_familyInfo);
  }

  const handleFamilyDOBChange = (e: any, index: Number) => {
    const _familyInfo = (familyInfo || []).map((info, i) => {
        if (i === index) {
          return {
            ...info,
            dateOfBirth: e.target.value,
          };
        }
  
        return info;
      });
  
      setFamilyInfo(_familyInfo);
  }

  const renderFormField = (
    name: string,
    label: string,
    type: string,
    validateFn?: Function,
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
        initialValues ={{
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          nationality: studentNationality,
          country: studentNationality && studentNationality.Title,
          familyMembers: familyInfo,
        }}
        onSubmit={(values, actions) => {
          
          values.nationality = studentNationality;
          values.country = studentNationality && studentNationality.Title;
          
          if (!values.firstName || !values.lastName || !values.dateOfBirth) {
            actions.setSubmitting(false);
            alert("Please provide necessary details!");
            return; 
          }

          if (familyInfo[0].firstName && familyInfo[0].lastName && familyInfo[0].dateOfBirth) {
            values.familyMembers = familyInfo;
          } else {
            values.familyMembers = [];            
          }

          dispatch(postStudent(values));
          
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
                  "text",
                  validateName
                )}
                {renderFormField(
                  "dateOfBirth",
                  "Date of Birth",
                  "date",
                  validateName
                )}
              </div>

              <div style={{ flex: "0 0 50%", padding: "10px" }}>
                {renderFormField("lastName", "Last Name", "text", validateName)}

                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Select
                    defaultValue={nationalities && nationalities[0].ID}
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
                  }}
                >
                  {familyInfo &&
                    familyInfo.map((fInfo, index) => {
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
                            <Input type="text" value={fInfo.firstName} onChange={(e) => handleFamilyNameChange(e, index)}  />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Last Name</FormLabel>
                            <Input type="text" value={fInfo.lastName} onChange={(e) => handleFamilyNameChange(e, index, true)}  />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Date of Birth</FormLabel>
                            <Input type="date" value={fInfo.dateOfBirth} onChange={(e) => handleFamilyDOBChange(e, index)}  />
                          </FormControl>

                          <FormControl style={{ marginBottom: "20px" }}>
                            <FormLabel>Country</FormLabel>
                            <Select
                                defaultValue={nationalities && nationalities[0].ID}
                                value={
                                    fInfo.nationality?.ID
                                }
                                onChange={(e) =>
                                    handleFamilyNationalityChange(e, index)
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
                                defaultValue={"Parent"}
                                value={fInfo.relationship || "Parent"}
                                onChange={(e) =>
                                    handleFamilyRelationChange(e, index)
                                }
                            >
                              {["Parent", "Sibling", "Spouse"].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      );
                    })}
                </div>

                <div style={{ flex: "0 0 50%", padding: "10px" }}></div>
              </div>
              <Button
                mt={12}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Save
              </Button>
              <Button
                mt={12}
                ml={4}
                backgroundColor={"#EDF2F"}
                onClick={onClose}
              >
                Cancel
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
