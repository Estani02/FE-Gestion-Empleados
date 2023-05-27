import { TextField } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { filterPosition } from "../../redux/positionSlice";

export const FormEmployee = () => {

    const dispatch = useDispatch();
    const department = useSelector(state => state.departments.data)
    const position = useSelector(state => state.position.data)
    const training = useSelector(state => state.trainings.data)

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [firstSelectorValue, setFirstSelectorValue] = useState('');
    const [secondSelectorEnabled, setSecondSelectorEnabled] = useState(false);
    const [idPosition, setIdPosition] = useState('')
    const [input, setInput] = useState({
        name: "",
        company: "",
        start_date: "",
        end_date: "",
        training: "",
        department: "",
        position: ""
    })

    function handleChangeDepartament(s) {
        dispatch(filterPosition(s.target.value))
        const selectedValue = s.target.value;
        setIdPosition('')
        if (s.target.value !== 'Departamento') {
            setFirstSelectorValue(selectedValue);
            setSecondSelectorEnabled(selectedValue !== '');
        }
    }

    function handleChangePosition(s) {
        setIdPosition(s.target.value)
    }

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="w-full flex justify-center items-center flex-col">
            <h3 className=" text-3xl underline font-bold">Nuevo empleado</h3>
            <form className="flex flex-col gap-5 mt-8">
                <div className="flex gap-32">
                    <TextField onChange={handleChange} name="name" id="outlined-basic" label="Nombre" variant="outlined" />
                    <TextField onChange={handleChange} id="outlined-basic" name="company" label="Empresa" variant="outlined" />
                </div>
                <div className="flex w-full justify-between gap-4">
                    <div className="flex flex-col gap-2 px-6 py-4 rounded-lg w-full">
                        <label className="font-bold">Fecha de Inicio</label>
                        <input className="border-b-4 rounded-lg px-4" name="start_date" type="date" onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-2 px-6 py-4 rounded-lg w-full">
                        <label className="font-bold">Fecha de Fin</label>
                        <input className="border-b-4 rounded-lg px-4" name="end_date" type="date" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className='font-bold mt-4 mb-5'>Curso realizado</span>
                    <TextField onChange={handleChange} id="outlined-basic" name="training" label="Curso" variant="outlined" />
                </div>
                <span className='font-bold mt-4'>Tipo de departamentos</span>
                <select value={firstSelectorValue} onChange={handleChangeDepartament} className='bg-[#d7d4d47c] p-[0.7rem] w-full rounded-[0.5rem]'>
                    <option disabled>Departamentos</option>
                    {department.map(d =>
                        <option key={d.id} value={d.id}>{d.name}</option>
                    )}
                </select>

                <span className='font-bold mt-4'>Tipo de cargos</span>
                <select disabled={!secondSelectorEnabled} onChange={handleChangePosition} className='bg-[#d7d4d47c] p-[0.7rem] rounded-[0.5rem] w-full'>
                    <option>Cargos</option>
                    {position.map(p =>
                        <option key={p.id} value={p.id}>{p.name}</option>
                    )}
                </select>
            </form>
        </div>
    )
}
