import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:3000/api/v1'

export const getPosition = createAsyncThunk('position/getPosition', async () => {
    const response = await axios.get(`${api}/positions`);
    return response.data;
});

export const filterPosition = (id) => {
    return async (dispatch) => {
        try {
            if (id === 'Departamento') return dispatch(getPosition())
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

const positionSlice = createSlice({
    name: 'position',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //GET
            .addCase(getPosition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosition.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getPosition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { setData } = positionSlice.actions;
export const { actions } = positionSlice;
export default positionSlice.reducer;