import { EmployeeTable } from "./components/table"
import { useDispatch } from 'react-redux';
import { getEmployee } from './redux/employeeSlice';
import { useEffect } from "react";
import { getDepatament } from "./redux/departmentsSlice";
import { getPosition } from "./redux/positionSlice";
import { FormEmployee } from "./components/creation_form";
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
    <div className="flex justify-center items-center flex-col gap-40">
      <h1 className="text-3xl font-bold underline">
        Gestion de Empleados
      </h1>
      <EmployeeTable />
      <FormEmployee />
    </div>
  )
}

export default App
