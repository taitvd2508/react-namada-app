import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../theme";

const StatBox = ({ title, subtitle, icon}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box width="100%" m="0 30px">
            <Box display="flex" alignItems="center" flexDirection={"column"}>
                <Box>
                    {icon}
                </Box>
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.blueAccent[500] }}
                    >
                        {title}
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt="2px">
                <Typography variant="h5" sx={{ color: colors.blueAccent[500] }}>
                    {subtitle}
                </Typography>
            </Box>
        </Box>
    );
};

export default StatBox;