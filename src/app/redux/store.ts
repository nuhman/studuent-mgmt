import { configureStore } from "@reduxjs/toolkit";
import { EnhancedStore } from "@reduxjs/toolkit/dist/configureStore";

// Reducers
import studentsReducer from './slices/students/studentsSlice';
import nationalitiesReducer from './slices/nationality/nationalitySlice';

export const store: EnhancedStore = configureStore({
    reducer: {
        studentsReducer: studentsReducer,
        nationalitiesReducer: nationalitiesReducer,
    }
});
