import { configureStore } from "@reduxjs/toolkit";
import employeeSlice from './employeeSlice'
import departmentsSlice from "./departmentsSlice";
import positionSlice from "./positionSlice";
import trainingSlice from "./trainingSlice";

export const store = configureStore({
    reducer: {
        employee: employeeSlice,
        departments: departmentsSlice,
        position: positionSlice,
        trainings: trainingSlice,
    }
})