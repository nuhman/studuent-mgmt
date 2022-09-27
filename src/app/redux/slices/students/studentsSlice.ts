import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FamilyMember, Nationality, Student, StudentList } from "../../types";

const initialState: StudentList = {
  students: [],
  loading: false,
  hasError: false,
};

export const getStudents = createAsyncThunk(
  "studentSlice/getStudents",
  async (payload, { dispatch }) => {
    dispatch(loadStudents());
    const url = "http://localhost:8088/api/Students";
    try {
      const rawResponse = await fetch(url);
      const students: Array<Student> = await rawResponse.json();
      const _students = [];

      // get student nationalities
      for (const student of students) {
        const nationality: Nationality = await getStudentNationality(student.ID);
        let familyMembers: Array<FamilyMember> = [];
        try {
          familyMembers = await getStudenFamilyMembers(student.ID);
        } catch (err) {
          console.log("Error occured while fetching API: ", url, " Error: ", err);
        }
        const _members: Array<FamilyMember> = (familyMembers || []).map(member => {
          
          return {
            ...member,
            country: member.nationality.Title,
            relation: member.relationship
          }
        });

        _students.push({
          ...student,
          nationality,
          country: nationality.Title,
          familyMembers: _members,
          dateOfBirth: student.dateOfBirth.split("T")[0]
        });
      }

      dispatch(studentsLoaded(_students));

    } catch (err) {
      console.log("Error occured while fetching API: ", url, " Error: ", err);
      dispatch(studentsLoadedError());
    }
  }
);

export const getStudentNationality = async (studentId: number) => {
  const url = `http://localhost:8088/api/Students/${studentId}/Nationality`;
  try {
    const rawResponse = await fetch(url);
    const nationality = await rawResponse.json();
    return nationality.nationality;
  } catch (err) {
    console.log("Error occured while fetching API: ", url, " Error: ", err);
    throw err;
  }
}

export const getStudenFamilyMembers = async (studentId: number) => {
  const url = `http://localhost:8088/api/Students/${studentId}/FamilyMembers`;
  try {
    const rawResponse = await fetch(url);
    const familyMembers = await rawResponse.json();
    return familyMembers;
  } catch (err) {
    console.log("Error occured while fetching API: ", url, " Error: ", err);
    throw err;
  }
}

export const updateStudentNationality = async (studentID: number, nationalityID: number) => {
  const url = `http://localhost:8088/api/Students/${studentID}/Nationality/${nationalityID}`;
  try {
    const rawResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentID, 
        nationalityID
      }),
    });
    const updatedStudent = await rawResponse.json();
    return updatedStudent;
  } catch (err) {
    console.log("Error occured while fetching API: ", url, " Error: ", err);
    throw err;
  }
}

export const insertStudentFamily = async (studentID: number, payload: any) => {
  const url = `http://localhost:8088/api/Students/${studentID}/FamilyMembers`;
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    });
    const updatedStudent = await rawResponse.json();
    return updatedStudent;
  } catch (err) {
    console.log("Error occured while fetching API: ", url, " Error: ", err);
    throw err;
  }
}

export const updateFamilyMember = async (memberID: number, payload: any) => {
  const url = `http://localhost:8088/api/FamilyMembers/${memberID}`;
  try {
    const rawResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const updatedMember = await rawResponse.json();
    return updatedMember;
  } catch (err) {
    console.log("Error occured while fetching API: ", url, " Error: ", err);
    throw err;
  }
}


export const updateFamilyMemberNationality = async (memberID: number, nationalityID: number) => {
  const url = `http://localhost:8088/api/FamilyMembers/${memberID}/Nationality/${nationalityID}`;
  try {
    const rawResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memberID, }),
    });
    const updatedMember = await rawResponse.json();
    return updatedMember;
  } catch (err) {
    console.log("Error occured while fetching API: ", url, " Error: ", err);
    throw err;
  }
}

export const postStudent = createAsyncThunk(
  "studentSlice/postStudent",
  async (payload: any, { dispatch }) => {
    const url = "http://localhost:8088/api/Students";

    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const student = await rawResponse.json();

      const { ID } = student;
      const _updatedStudentNationality = await updateStudentNationality(ID, (Number(payload.nationality?.ID) || 1));
      const _members: Array<FamilyMember> = [];

      for (const member of payload.familyMembers) {
        const _updatedMember = await insertStudentFamily(
          ID,
          { 
            firstName: member.firstName,
            lastName: member.lastName,
            dateOfBirth: member.dateOfBirth,
            relationship: member.relationship
          }
        );

        await updateFamilyMemberNationality(_updatedMember.ID, (Number(member.nationality?.ID) || 1));
        
        _members.push({
          ...member,
          ID: _updatedMember.ID,
          firstName: _updatedMember.firstName,
          lastName: _updatedMember.lastName,
          dateOfBirth: _updatedMember.dateOfBirth,
          relationship: _updatedMember.relationship
        })
      }

      dispatch(studentAdded({
        ...student,
        nationality: _updatedStudentNationality.nationality,
        country: _updatedStudentNationality.nationality?.Title,
        familyMembers: _members,
      }));
    } catch (err) {
      console.log("Error occured while fetching API: ", url, " Error: ", err);
      dispatch(studentsAddedError());
    }
  }
);

export const putStudent = createAsyncThunk(
  "studentSlice/putStudent",
  async (payload: any, { dispatch }) => {
    dispatch(updateStudent())
    const url = `http://localhost:8088/api/Students/${payload.ID}`;

    try {
      const rawResponse = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const student: Student = await rawResponse.json();
      console.log("DXD: here:", payload);
      const _updatedStudentNationality = await updateStudentNationality(student.ID, payload.nationality.ID);
      const _members: Array<FamilyMember> = [];

      for (const member of payload.familyMembers) {
        const _updatedMember = await updateFamilyMember(
          member.ID, 
          { 
            firstName: member.firstName,
            lastName: member.lastName,
            dateOfBirth: member.dateOfBirth,
            relationship: member.relationship
          }
        );
        
        _members.push({
          ...member,
          firstName: _updatedMember.firstName,
          lastName: _updatedMember.lastName,
          dateOfBirth: _updatedMember.dateOfBirth,
          relationship: _updatedMember.relationship
        })
      }

      if (payload.newMember && payload.newMember.firstName && payload.newMember.lastName && payload.newMember.dateOfBirth) {
        const _updatedMember = await insertStudentFamily(
          student.ID,
          { 
            firstName: payload.newMember.firstName,
            lastName: payload.newMember.lastName,
            dateOfBirth: payload.newMember.dateOfBirth,
            relationship: payload.newMember.relationship
          }
        );

        await updateFamilyMemberNationality(_updatedMember.ID, (Number(payload.newMember.nationality?.ID) || 1));
        
        _members.push({
          ...payload.newMember,
          ID: _updatedMember.ID,
          firstName: _updatedMember.firstName,
          lastName: _updatedMember.lastName,
          dateOfBirth: _updatedMember.dateOfBirth,
          relationship: _updatedMember.relationship
        });
      }

      dispatch(studentUpdated({
        ...student,
        nationality: _updatedStudentNationality.nationality,
        country: _updatedStudentNationality.nationality?.Title,
        familyMembers: _members,
      }));
    } catch (err) {
      console.log("Error occured while fetching API: ", url, " Error: ", err);
      dispatch(studentsUpdatedError());
    }
  }
);

export const studentsSlice = createSlice({
  name: "studentSlice",
  initialState,
  reducers: {
    loadStudents(state) {
      state.loading = true;
      state.hasError = false;
      state.students = [];
    },

    studentsLoaded(state, action: PayloadAction<Student[]>) {
      state.students = action.payload;
      state.loading = false;
    },
    studentsLoadedError(state) {
      state.hasError = true;
      state.loading = false;
    },

    addStudent(state) {
      state.loading = true;
      state.hasError = false;
    },
    studentAdded(state, action: PayloadAction<Student>) {
      state.students = [...state.students, action.payload];
      state.loading = false;
    },
    studentsAddedError(state) {
      state.hasError = true;
      state.loading = false;
    },

    // Student data modification - PUT
    updateStudent(state) {
      state.loading = true;
      state.hasError = false;
    },
    studentUpdated(state, action: PayloadAction<Student>) {
      state.students = state.students.map(student => {
        if (student.ID !== action.payload.ID) return student;
        return action.payload;
      });
      state.loading = false;
    },
    studentsUpdatedError(state) {
      state.hasError = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStudents.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getStudents.fulfilled, (state, action) => {
      //state.students = action.payload;
      state.loading = false;
    });
    builder.addCase(getStudents.rejected, (state, action) => {
      state.hasError = true;
      state.loading = false;
    });

    builder.addCase(postStudent.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postStudent.fulfilled, (state, action) => {
      //state.students = action.payload;
      state.loading = false;
    });
    builder.addCase(postStudent.rejected, (state, action) => {
      state.hasError = true;
      state.loading = false;
    });
  },
});

export const {
  loadStudents,
  studentsLoaded,
  studentsLoadedError,
  addStudent,
  studentAdded,
  studentsAddedError,
  updateStudent,
  studentUpdated,
  studentsUpdatedError,
} = studentsSlice.actions;

export default studentsSlice.reducer;
