import { Button, Collapse, TextField } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { filterPosition } from "../../redux/positionSlice";
import validation from "./validations";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import arrow from '../../assets/arrowBlue.png'
import { createEmployee } from "../../redux/employeeSlice";

export const FormEmployee = () => {
    const initialFormState = {
        name: "",
        company: "",
        start_date: "",
        end_date: "",
        training: "",
        department_id: "",
        position_id: ""
    };

    const dispatch = useDispatch();
    const requestError = useSelector(state => state.employee.postError)
    const department = useSelector(state => state.departments.data)
    const position = useSelector(state => state.position.data)

    const [collapse, setCollapse] = useState(false)
    const [firstSelectorValue, setFirstSelectorValue] = useState('');
    const [secondSelectorEnabled, setSecondSelectorEnabled] = useState(false);
    const [input, setInput] = useState(initialFormState)

    const [error, setError] = useState({ undefined })

    function handleChangeDepartament(s) {
        dispatch(filterPosition(s.target.value))
        const selectedValue = s.target.value;
        setInput({
            ...input,
            position_id: "",
            department_id: s.target.value
        })
        if (s.target.value !== 'Departamento') {
            setFirstSelectorValue(selectedValue);
            setSecondSelectorEnabled(selectedValue !== '');
        }
    }

    function handleChangePosition(s) {
        setInput({
            ...input,
            position_id: s.target.value
        })
        setError(validation({
            ...input,
            position_id: s.target.value
        }))
    }

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
        setError(validation({
            ...input,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (Object.keys(error).length === 0 && input.name.length) {
            dispatch(createEmployee(input))
            if (!requestError) {
                setInput(initialFormState)
                toast.success('Empleado creado con exito!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.error('Erros del servidor!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } else {
            console.log(error)
            toast.warn('No se creo el empleado!', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    function handleCollapse() {
        setCollapse(!collapse)
    }

    const disabledEnviar = Object.keys(error).length !== 0

    return (
        <div className="w-full flex justify-center items-center flex-col">
            <Button style={{ fontWeight: 'bold', color: '#017AFE' }} onClick={handleCollapse}>CREAR NUEVO EMPLEADO <img src={arrow} className={`w-[10px] ml-2 transition-all ${collapse ? '-rotate-90' : 'rotate-90'}`} /></Button>
            <Collapse in={collapse}>
                <h3 className=" text-3xl underline font-bold">Nuevo empleado</h3>
                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5 mt-8 py-10 px-24 rounded-lg shadow-2xl">
                    <div className="flex gap-32">
                        <TextField onChange={handleChange} value={input.name} name="name" id="outlined-basic" label="Nombre y Apellido" variant="outlined" />
                        <TextField onChange={handleChange} value={input.company} id="outlined-basic" name="company" label="Empresa" variant="outlined" />
                    </div>
                    <div className="flex w-full justify-between gap-4">
                        <div className="flex flex-col gap-2 px-6 py-4 rounded-lg w-full">
                            <label className="font-bold">Fecha de Inicio</label>
                            <input className="border-b-4 rounded-lg px-4" value={input.start_date} name="start_date" type="date" onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-2 px-6 py-4 rounded-lg w-full">
                            <label className="font-bold">Fecha de Fin</label>
                            <input className="border-b-4 rounded-lg px-4" value={input.end_date} name="end_date" type="date" onChange={handleChange} />
                            {error.end_date === 'La fecha de fin es menor a la de inicio' ? <span className="whitespace-nowrap text-red-500 font-semibold">*{error.end_date}</span> : undefined}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className='font-bold mt-4 mb-5'>Curso realizado</span>
                        <TextField onChange={handleChange} value={input.training} id="outlined-basic" name="training" label="Curso" variant="outlined" />
                    </div>
                    <span className='font-bold mt-4'>Tipo de departamentos</span>
                    <select value={firstSelectorValue} onChange={handleChangeDepartament} className='bg-[#d7d4d47c] p-[0.7rem] w-full rounded-[0.5rem]'>
                        <option disabled>Departamentos</option>
                        {department.map(d =>
                            <option key={d.id} value={d.id}>{d.name}</option>
                        )}
                    </select>

                    <span className='font-bold mt-4'>Tipo de cargos</span>
                    <select value={input.position_id} disabled={!secondSelectorEnabled} onChange={handleChangePosition} className='bg-[#d7d4d47c] p-[0.7rem] rounded-[0.5rem] w-full'>
                        <option>Cargos</option>
                        {position.map(p =>
                            <option key={p.id} value={p.id}>{p.name}</option>
                        )}
                    </select>

                    <Button disabled={disabledEnviar} type='submit' onClick={handleSubmit} variant='contained'>Crear Empleado</Button>
                </form>
            </Collapse>
            <ToastContainer />
        </div>
    )
}
