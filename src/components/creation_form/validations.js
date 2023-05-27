
export default function validation({
    name,
    company,
    start_date,
    end_date,
    training,
    department_id,
    position_id }) {

    let error = {}
    const valName = /^[a-zA-Z\s]+$/

    function isDateGreaterThan(date1, date2) {
        const formattedDate1 = new Date(date1);
        const formattedDate2 = new Date(date2);

        return formattedDate1 > formattedDate2;
    }

    // NAME
    if (!name) error.name = 'El nombre es necesario'

    if (!valName.test(name)) error.name = "El nombre debe ser solo letras"

    // COMPANY
    if (!company) error.company = 'El nombre de la empresa es necesario'

    // START_DATE
    if (!start_date) error.start_date = 'La fecha de inicio es necesario'

    // END_DATE
    if (!end_date) error.end_date = 'La fecha de fin es necesario'

    if (isDateGreaterThan(start_date, end_date)) {
        error.end_date = 'La fecha de fin es menor a la de inicio'
    }

    // TRAINING
    if (!training) error.training = 'El curso es necesario'

    // DEPATAMENT
    if (!department_id) error.department_id = 'El depatamento es necesario'

    // POSITION
    if (!position_id) error.position_id = 'El cargo es necesario'

    return error
}