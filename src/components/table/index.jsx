import { useSelector } from "react-redux";
import EmployeeTableRow from "./EmployeeTableRow ";
import SearchBar from "../search_bar";

export const EmployeeTable = () => {

    const state = useSelector((state) => state.employee);

    return (
        <div className='min-w-full flex justify-center flex-col'>
            <div className="flex flex-col justify-center items-center w-full">
                <SearchBar />
            </div>
            <table className="bg-white rounded-lg shadow-2xl">
                <thead>
                    <tr>
                        <th className="py-3 px-6 font-bold uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                            Nombre
                        </th>
                        <th className="py-3 px-6 font-bold uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                            Departamento
                        </th>
                        <th className="py-3 px-6 font-bold uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                            Cargo
                        </th>
                        <th className="py-3 px-6 font-bold uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                            Experiencia
                        </th>
                        <th className="py-3 px-6 font-bold uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                            Cursos
                        </th>
                        <th className="py-3 px-6 font-bold uppercase bg-gray-100 text-gray-600 border-b border-gray-200" />
                    </tr>
                </thead>
                <tbody>
                    {state.loading || state.postError ? (
                        <tr>
                            <td colSpan={6} className="bg-gray-200 text-center h-60 font-bold">Cargando lista de empleados...</td>
                        </tr>
                    ) : state.temporal.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="bg-gray-200 text-center h-60 font-bold">No se ha encontrado ningún empleado</td>
                        </tr>
                    ) : (
                        state.temporal.map((employee, index) => (
                            <EmployeeTableRow key={index} employee={employee} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
