import { EmployeeTable } from "./components/table"
import { useDispatch } from 'react-redux';
import { getEmployee } from './redux/employeeSlice';
import { useEffect } from "react";
import { getDepatament } from "./redux/departmentsSlice";
import { getPosition } from "./redux/positionSlice";
import { FormEmployee } from "./components/form_employee";
import { getTrainings } from "./redux/trainingSlice";


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployee());
    dispatch(getDepatament())
    dispatch(getPosition())
    dispatch(getTrainings())
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex justify-center items-center flex-col mb-10">
        <h1 className="text-3xl font-bold underline mt-20 mb-[5rem]">
          Gestion de Empleados
        </h1>
        <EmployeeTable />
      </div>
      <FormEmployee />
    </div>
  )
}

export default App
