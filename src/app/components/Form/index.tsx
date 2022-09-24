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
import { get as _get } from "lodash";

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

  (student.familyMembers || []).forEach(member => {
    
  });

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

  const renderFormField = (
    name: string,
    label: string,
    validateFn: Function,
    type: string,
    options?: any
  ) => {
    const formatSelectValue = (key: string, value: string): string => {
      if (value) {
        return `${key}-${value}`;
      }
      return key;
    };

    return (
      <Field name={name} validate={validateFn}>
        {({ field, form }: any) => {
          if (options)
            console.log(
              "DXD: name: ",
              name,
              `${formatSelectValue(
                _get(form.values, options.valueKey),
                options.value
              )}`,
              " | defaultValue: ", options.defaultValue
            );
          return (
            <FormControl
              isInvalid={form.errors[name] && form.touched[name]}
              style={{ marginBottom: "20px" }}
            >
              <FormLabel>{label}</FormLabel>

              {type === "select" ? (
                <Select
                  {...field}
                  defaultValue={options.defaultValue}
                  value={`${formatSelectValue(
                    _get(form.values, options.valueKey),
                    options.value
                  )}`}
                >
                  {options.options.map((n: any) => (
                    <option key={n.ID} value={n.ID}>
                      {n.Title}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input {...field} placeholder={label} type={type} />
              )}

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
                {renderFormField(
                  "nationality",
                  "Country",
                  validateName,
                  "select",
                  {
                    defaultValue: student.nationality?.ID,
                    valueKey: "nationality.ID",
                    options: nationalities,
                  }
                )}
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

              {student?.familyMembers?.map((member, index) => {
                console.log("DXD: ***", `${member.ID}-${member.relationship}`);
                return (
                  <div>
                    {renderFormField(
                      `firstName_${member.ID}`,
                      "First Name",
                      validateName,
                      "text"
                    )}
                    {renderFormField(
                      `lastName_${member.ID}`,
                      "Last Name",
                      validateName,
                      "text"
                    )}
                    {renderFormField(
                      `relationship_${member.ID}`,
                      "Relationship",
                      validateName,
                      "select",
                      {
                        defaultValue: `${member.ID}-${member.relationship}`,
                        //valueKey: `familyMembers[${index}].ID`,
                        valueKey: `relationship_${member.ID}`,
                        options: [
                          { ID: `${member.ID}-Parent`, Title: "Parent" },
                          { ID: `${member.ID}-Sibling`, Title: "Sibling" },
                          { ID: `${member.ID}-Spouse`, Title: "Spouse" },
                        ],
                      }
                    )}
                  </div>
                );
              })}

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
