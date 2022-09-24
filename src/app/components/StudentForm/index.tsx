import React from "react";
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
import { useSelector } from "react-redux";

export function StudentForm({ studentInfo }: { studentInfo: any }) {
  const student: Student = {
    ID: studentInfo.ID,
    firstName: studentInfo.firstName,
    lastName: studentInfo.lastName,
    country: studentInfo.country,
    nationality: studentInfo.nationality,
    dateOfBirth:
      studentInfo.dateOfBirth && studentInfo.dateOfBirth.split("T")[0],
    familyMembers: studentInfo.familyMembers,
  };

  const nationalities: Array<Nationality> = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.nationalities
  );
  const nationalitiesLoadedError: boolean = useSelector(
    (state: { nationalitiesReducer: NationalityList }) =>
      state.nationalitiesReducer.hasError
  );

  function validateName(value: string) {
    let error;
    if (!value) {
      error = "Name is required";
    }
    return error;
  }

  return (
    <Wrapper>
      <Formik
        initialValues={student}
        onSubmit={(values, actions) => {
          const nationality = nationalities.find(
            (n) => n.ID === Number(values.nationality)
          );
          values.nationality = nationality;
          values.country = nationality?.Title;

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
                <Field name="firstName" validate={validateName}>
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={
                        form.errors.firstName && form.touched.firstName
                      }
                      style={{ marginBottom: "20px" }}
                    >
                      <FormLabel>First name</FormLabel>
                      <Input {...field} placeholder="First Name" />
                      <FormErrorMessage>
                        {form.errors.firstName}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="dateOfBirth" validate={validateName}>
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={
                        form.errors.dateOfBirth && form.touched.dateOfBirth
                      }
                      style={{ marginBottom: "20px" }}
                    >
                      <FormLabel>Date of Birth</FormLabel>
                      <Input
                        {...field}
                        type="date"
                        placeholder="Date of Birth"
                      />
                      <FormErrorMessage>
                        {form.errors.dateOfBirth}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </div>

              <div style={{ flex: "0 0 50%", padding: "10px" }}>
                <Field name="lastName" validate={validateName}>
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={form.errors.lastName && form.touched.lastName}
                      style={{ marginBottom: "20px" }}
                    >
                      <FormLabel>Last name</FormLabel>
                      <Input {...field} placeholder="Last Name" />
                      <FormErrorMessage>
                        {form.errors.lastName}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="nationality" validate={validateName}>
                  {({ field, form }: any) => (
                    <FormControl
                      isInvalid={
                        form.errors.nationality && form.touched.nationality
                      }
                      style={{ marginBottom: "20px" }}
                    >
                      <FormLabel>Country</FormLabel>
                      <Select {...field} value={student.nationality?.ID}>
                        {nationalities.map((n) => (
                          <option key={n.ID} value={n.ID}>
                            {n.Title}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.nationality}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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

              {
                student?.familyMembers?.map(member => {
                    return (
                        <div>
                            <Field name="nationality" validate={validateName}>
                                {({ field, form }: any) => (
                                <FormControl
                                    isInvalid={
                                    form.errors.nationality && form.touched.nationality
                                    }
                                    style={{ marginBottom: "20px" }}
                                >
                                    <FormLabel>Country</FormLabel>
                                    <Select {...field} value={student.nationality?.ID}>
                                    {nationalities.map((n) => (
                                        <option key={n.ID} value={n.ID}>
                                        {n.Title}
                                        </option>
                                    ))}
                                    </Select>
                                    <FormErrorMessage>
                                    {form.errors.nationality}
                                    </FormErrorMessage>
                                </FormControl>
                                )}
                            </Field>
                        </div>
                    )
                })
              }

              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Submit
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
