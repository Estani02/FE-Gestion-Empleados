import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:3000/api/v1'

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const getEmployee = createAsyncThunk('todos/getEmployee', async () => {
    const response = await axios.get(`${api}/employees`);

    const sortedData = response.data.sort((a, b) => a.id - b.id);
    return sortedData;
});

export const deleteEmployee = createAsyncThunk(
    'employeeSlice/deleteEmployee',
    async (id, { getState, dispatch }) => {
        try {
            const dataR = getState().employee.data
            const r = await axios.delete(`${api}/employees/${id}`);
            const newData = dataR.filter(e => e.id !== id)
            dispatch(setDataRequest(newData))
            return r
        } catch (error) {
            throw new Error(error);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employeeSlice/updateEmployee',
    async (id, { dispatch }) => {
        try {
            const response = await axios.put(`${api}/employees/${id.id}`, { position_id: id.idPosition });
            dispatch(getEmployee())
            return response.data;
        } catch (error) {
            throw new Error('No se pudo actualizar el empleado.');
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employeeSlice/createEmployee',
    async (employeeData) => {
        try {
            // Realizar el primer POST para crear el empleado
            const response = await axios.post(`${api}/employees`, { name: employeeData.name, position_id: employeeData.position_id });
            const createEmployee = response.data;

            const employeeId = createEmployee.id;

            const historieData = {
                employee_id: employeeId,
                start_date: employeeData.start_date,
                end_date: employeeData.end_date,
                company: employeeData.company
            };

            await axios.post(`${api}/employment_histories`, historieData);

            const trainingData = {
                employee_id: employeeId,
                name: employeeData.training
            }

            await axios.post(`${api}/trainings`, trainingData);

            const res = await axios.get(`${api}/employees`);
            return res.data;
        } catch (error) {
            // Manejar errores
            throw new Error('Error al crear el empleado y asignar el curso.');
        }
    }
);

export const filterEmployee = createAsyncThunk(
    'employeeSlice/searchTerm',
    async (_, { dispatch, getState }) => {
        const searchInput = getState()
        const searchTermWithoutAccents = removeAccents(searchInput);

        const employee = getState().employee.data
        if (searchTermWithoutAccents.trim().length <= 1) {
            dispatch(getEmployee())
        } else {
            const employeeFilter = employee.filter((employee) => {
                const employeeNameWithoutAccents = removeAccents(employee.name.toLowerCase());
                return employeeNameWithoutAccents.includes(searchInput);
            })
            dispatch(setDataRequest(employeeFilter))
        }
    }
)

const initialState = {
    data: [],
    temporal: [],
    loading: false,
    error: null,
    postError: null,
    searchTerm: ''
}

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            const searchTerm = action.payload.toLowerCase().trim();
            const searchTermWithoutAccents = removeAccents(searchTerm);

            if (searchTermWithoutAccents.length === 1) {
                state.temporal = state.data;
            } else {
                state.searchTerm = searchTerm;
                state.temporal = state.data.filter((employee) => {
                    const employeeNameWithoutAccents = removeAccents(employee.name.toLowerCase());
                    return employeeNameWithoutAccents.includes(searchTermWithoutAccents);
                });
            }
        },
        setDataRequest: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(getEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.temporal = action.payload;
            })
            .addCase(getEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // DELETE
            .addCase(deleteEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedEmployeeId = action.payload.data.id;
                state.data = state.data.filter((employee) => employee.id !== deletedEmployeeId);
                state.temporal = action.payload;
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // PUT
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                // Actualiza el empleado en el estado local
                const updatedEmployee = action.payload;
                state.temporal = state.temporal.map((employee) =>
                    employee.id === updatedEmployee.id ? updatedEmployee : employee
                );
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // POST
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.postError = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.temporal = action.payload;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.postError = action.error.message;
            })

            // SEARCH
            .addCase(filterEmployee.pending, (state) => {
                state.loading = true;
                state.postError = null;
            })
            .addCase(filterEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.temporal = action.payload
            })
            .addCase(filterEmployee.rejected, (state, action) => {
                state.loading = false;
                state.postError = action.error.message;
            });
    },
});

export const { setDataRequest, setSearchTerm } = employeeSlice.actions;
export const { actions } = employeeSlice;
export default employeeSlice.reducer;
