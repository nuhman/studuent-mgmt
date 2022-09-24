import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Student, StudentList } from "../../types";

const initialState: StudentList = {
  students: [],
  loading: false,
  hasError: false,
};

export const getStudents = createAsyncThunk(
  'studentSlice/getStudents',
  async (payload, { dispatch }) => {
    dispatch(loadStudents());
    const url = 'http://localhost:8088/api/Students';
    return fetch(url).then((res) => {
      return res.json();
    }).then(students => {
      dispatch(studentsLoaded(students));
    }).catch(err => {
      console.log('Error occured while fetching API: ', url, ' Error: ', err);
      dispatch(studentsLoadedError());
    });
  }
)

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
  }
});

export const { loadStudents, studentsLoaded, studentsLoadedError } = studentsSlice.actions;

export default studentsSlice.reducer;
