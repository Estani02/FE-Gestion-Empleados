import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = 'http://localhost:3000/api/v1'

export const getEmployee = createAsyncThunk('todos/getEmployee', async () => {
    const response = await axios.get(`${api}/employees`);
    return response.data;
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

export const createEmployee = async ({ employeeData }) => {
    try {
        // Realizar el primer POST para crear el empleado
        const response = await axios.post(`${api}/employees/${employeeData.id}`, { name: employeeData.name, position_id: employeeData.idPosition });
        const createEmployee = response.data;

        // Obtener el ID del empleado recién creado
        const employeeId = createEmployee.id;

        // Realizar el segundo POST para asignar el curso al empleado
        const cursoData = {
            employee_id: employeeId,
            // Otros datos del curso...
        };

        const responseCurso = await axios.post('URL_DEL_ENDPOINT_PARA_ASIGNAR_CURSO', cursoData);
        const cursoAsignado = responseCurso.data;

        // Otros POSTs que dependan de la creación del empleado o asignación de curso...

        // Retornar los datos necesarios
        return {
            empleado: createEmployee,
            curso: cursoAsignado,
        };
    } catch (error) {
        // Manejar errores
        throw new Error('Error al crear el empleado y asignar el curso.');
    }
};

const initialState = {
    data: [],
    loading: false,
    error: null,
}

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
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
                state.data = state.data.map((employee) =>
                    employee.id === updatedEmployee.id ? updatedEmployee : employee
                );
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

    },
});

export const { setDataRequest } = employeeSlice.actions;
export const { actions } = employeeSlice;
export default employeeSlice.reducer;
