import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:3000/api/v1'

export const getTrainings = createAsyncThunk('trainings/getTrainings', async () => {
    const response = await axios.get(`${api}/trainings`);
    return response.data;
});

export const filterTrainings = (id) => {
    return async (dispatch) => {
        try {
            if (id === 'Departamento') return dispatch(getTrainings())
            const allData = await axios.get(`${api}/positions`)

            const filteredEmployees = allData.data.filter(employee => employee.department_id === parseInt(id));

            dispatch(setData(filteredEmployees))
        } catch (error) {
            throw new Error(error)
        }
    }
}

const initialState = {
    data: [],
    loading: false,
    error: null
}

const trainingSlice = createSlice({
    name: 'trainings',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //GET
            .addCase(getTrainings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTrainings.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getTrainings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { setData } = trainingSlice.actions;
export const { actions } = trainingSlice;
export default trainingSlice.reducer;