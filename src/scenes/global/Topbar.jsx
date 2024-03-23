import {Box, IconButton, useTheme} from "@mui/material";
import {useContext, useState} from "react";
import {ColorModeContext, tokens} from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {useNavigate} from "react-router-dom";
import {BLOCK_ROUTER, TRANSACTION_ROUTER, VALIDATOR_ROUTER} from "../../constant";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const colorMode = useContext(ColorModeContext)
    const navigate = useNavigate();
    const [value, setValue] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const bh = Number(value);
        if (value?.length === 64) {
            navigate(`/${TRANSACTION_ROUTER}/${value}`);
            setValue('');
        } else if (typeof bh === 'number' && bh) {
            navigate(`/${BLOCK_ROUTER}/${value}`);
            setValue('');
        } else if (value?.length === 40) {
            navigate(`/${VALIDATOR_ROUTER}/${value}`);
            setValue('');
        } else {
            toast("Value search don't match Block Height, Transaction Hash or Validator Address", {
                position: 'top-right',
                type: 'error',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: "colored"
            });
        }
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="8px"
                sx={{ml: 3, width: '600px', height: '54px'}}
            >
                <InputBase
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            handleSubmit(ev);
                        }
                    }}
                    sx={{ml: 2, flex: 1, fontSize: '16px'}}
                    placeholder="Search for Block Height / Transaction Hash / Validator Address or Name"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}/>
                <IconButton type="button" sx={{p: 2}} onClick={handleSubmit}>
                    <SearchOutlinedIcon/>
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex" sx={{mr: 2, p: 1}}>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon/>
                    ) : (
                        <LightModeOutlinedIcon/>
                    )}
                </IconButton>
            </Box>
        </Box>
    );
}

export default Topbar;