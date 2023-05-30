import { IconButton, InputBase } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../redux/employeeSlice";

const SearchBar = () => {

    const searchTerm = useSelector((state) => state.searchTerm);
    const dispatch = useDispatch();

    function handleChange(e) {
        dispatch(setSearchTerm(e.target.value))
    }

    return (
        <div className="border rounded-lg mb-6">
            <InputBase
                onChange={(e) => handleChange(e)} value={searchTerm}
                sx={{ ml: 1, flex: 1, px: 2 }}
                placeholder="Buscar por Nombre"
                inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </div >
    )
}

export default SearchBar