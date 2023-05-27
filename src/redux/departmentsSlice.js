import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:3000/api/v1'

export const getDepatament = createAsyncThunk('depatament/getDepatament', async () => {
    const response = await axios.get(`${api}/departments`);
    return response.data;
});

const initialState = {
    data: [],
    loading: false,
    error: null
}

const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //GET
            .addCase(getDepatament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDepatament.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getDepatament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { actions } = departmentsSlice;
export default departmentsSlice.reducer;