import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { NationalityList, Nationality } from "../../types";

const initialState: NationalityList = {
  nationalities: [],
  loading: false,
  hasError: false,
};

export const getNationalities = createAsyncThunk(
  'nationalitySlice/getNationalities',
  async (payload, { dispatch, getState }) => {
    dispatch(loadNationalities());
    const url = 'http://localhost:8088/api/Nationalities';
    return fetch(url).then((res) => {
      return res.json();
    }).then(nationalities => {
      dispatch(nationalitiesLoaded(nationalities));
    }).catch(err => {
      console.log('Error occured while fetching API: ', url, ' Error: ', err);
      dispatch(nationalitiesLoadedError());
    });
  }
)

export const nationalitiesSlice = createSlice({
  name: "nationalitySlice",
  initialState,
  reducers: {
    loadNationalities(state) {
      state.loading = true;
      state.hasError = false;
      state.nationalities = [];
    },
   
    nationalitiesLoaded(state, action: PayloadAction<Nationality[]>) {
      state.nationalities = action.payload;
      state.loading = false;
    },
    nationalitiesLoadedError(state) {
        state.hasError = true;
        state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNationalities.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getNationalities.fulfilled, (state, action) => {
      //state.students = action.payload;
      state.loading = false;
    });
    builder.addCase(getNationalities.rejected, (state, action) => {
      state.hasError = true;
      state.loading = false;
    });
  }
});

export const { loadNationalities, nationalitiesLoaded, nationalitiesLoadedError } = nationalitiesSlice.actions;

export default nationalitiesSlice.reducer;
