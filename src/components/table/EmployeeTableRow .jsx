/* eslint-disable react/prop-types */
import { useState } from 'react';
import pencil from '../../assets/pencil.svg';
import trash from '../../assets/trash.svg';
import info from '../../assets/informacion.png'
import { Button, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmployee, updateEmployee } from '../../redux/employeeSlice';
import { filterPosition } from '../../redux/positionSlice';

const EmployeeTableRow = ({ employee }) => {

    const dispatch = useDispatch();
    const department = useSelector(state => state.departments.data)
    const position = useSelector(state => state.position.data)

    const initialOpen = {
        openEdit: false,
        openDelete: false,
        openInfo: false
    }

    const [open, setOpen] = useState(initialOpen)

    const [id, setId] = useState('');
    const [idPosition, setIdPosition] = useState('')
    const [firstSelectorValue, setFirstSelectorValue] = useState('');
    const [secondSelectorEnabled, setSecondSelectorEnabled] = useState(false);

    function handleOpen(id, nameButtom) {

        setOpen({
            ...open,
            [nameButtom]: true
        });
        setId(id)
    }

    function handleClose() {
        setOpen(initialOpen)
    }

    function handleDelateRequest() {
        dispatch(deleteEmployee(id));
        handleClose()
    }

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

    function handlePutRequest() {
        dispatch(updateEmployee({ id, idPosition }))
        handleClose()
    }

    return (
        <tr>
            <Modal
                open={open.openEdit}
                onClose={handleClose}
            >
                <div className='bg-white absolute w-[25rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-8 bg-whiter rounded-[0.5rem] flex items-center justify-center flex-col gap-5'>
                    <form className='flex items-center justify-center flex-col gap-5'>
                        <p className='font-bold text-2xl'>Cambio de Cargo</p>
                        <span className='font-bold mt-4'>Tipo de departamentos</span>
                        <select value={firstSelectorValue} onChange={handleChangeDepartament} className='bg-[#d7d4d47c] p-[0.7rem] w-full rounded-[0.5rem]'>
                            <option disabled>Departamento</option>
                            {department.map(d =>
                                <option key={d.id} value={d.id}>{d.name}</option>
                            )}
                        </select>
                        <span className='font-bold mt-4'>Tipo de cargos</span>
                        <select disabled={!secondSelectorEnabled} onChange={handleChangePosition} className='bg-[#d7d4d47c] p-[0.7rem] rounded-[0.5rem] w-full'>
                            <option>Cargo</option>
                            {position.map(p =>
                                <option key={p.id} value={p.id}>{p.name}</option>
                            )}
                        </select>
                        <div className='flex gap-11 mt-5'>
                            <Button disabled={idPosition.length === 0} onClick={handlePutRequest} style={{ background: '#ffc4cd', color: '#e00b2b' }} variant='contained'>Editar</Button>
                            <Button onClick={handleClose} variant='contained'>Cancelar</Button>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                open={open.openDelete}
                onClose={handleClose}
            >
                <div className='absolute bg-white w-[32rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-8 bg-whiter rounded-[0.5rem] flex items-center justify-center'>
                    <div className='flex flex-col'>
                        <div className='flex flex-col justify-center items-center mb-8'>
                            <p>¿Estás seguro de quieres eliminar los datos del empleado?</p>
                            <b>No se podrá deshacer el cambio una vez eliminado</b>
                        </div>
                        <div className='flex flex-row gap-4 w-full justify-center items-center'>
                            <Button style={{ background: '#ffc4cd', color: '#e00b2b' }} onClick={handleDelateRequest} variant='contained'>Si</Button>
                            <Button onClick={handleClose} variant='contained'>Cancelar</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                open={open.openInfo}
                onClose={handleClose}
            >
                <div className='absolute bg-white w-[32rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-8 bg-whiter rounded-[0.5rem] flex flex-col'>
                    <h4 className='w-full text-center mb-5 text-2xl font-bold'>Experiencia de {employee.name}</h4>
                    <ul className='flex flex-col justify-start w-full'>
                        <li><b>Empresa:</b> {employee?.employment_history.company}</li>
                        <li><b>Fecha de Inicio:</b> {employee?.employment_history.start_date}</li>
                        <li><b>Fecha de Fin:</b> {employee?.employment_history.end_date}</li>
                    </ul>
                </div>
            </Modal>
            <td className="py-4 px-6 border-b border-gray-200 border-r">{employee?.name}</td>
            <td className="py-4 px-6 border-b border-gray-200 border-r">{employee?.position.department}</td>
            <td className="py-4 px-6 border-b border-gray-200 border-r">{employee?.position.name}</td>
            <td className="py-4 px-8 border-b border-gray-200 border-r">
                <div className='flex flex-col md:flex-row items-center justify-between'>
                    {employee?.employment_history.company}
                    <button className='ml-5 h-[20px]' onClick={() => handleOpen(undefined, 'openInfo')} >
                        <img src={info} alt="info" className='max-w-full max-h-full' />
                    </button>
                </div>
            </td>
            <td className="py-4 px-6 border-b border-gray-200 border-r">{employee?.trainings.name}</td>
            <td className="py-4 px-6 border-b border-gray-200">
                <div className='flex gap-3'>
                    <button onClick={() => handleOpen(employee.id, 'openEdit')} className='bg-[#BDF5D3] w-8 px-1 py-1 rounded-md'>
                        <img src={pencil} alt='Lapiz' />
                    </button>
                    <button onClick={() => handleOpen(employee.id, 'openDelete')} className='bg-[#ffc4cd] w-8 px-1 py-1 rounded-md'>
                        <img src={trash} alt='Tacho de basura' />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default EmployeeTableRow;
