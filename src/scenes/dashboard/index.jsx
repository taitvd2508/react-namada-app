import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import {fetchValidator} from "../../services/validator";
import {getLastCommit} from "../../services/block";
import {useQuery} from "@tanstack/react-query";
import moment from 'moment';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data: rawValidatorData } = useQuery({
        queryKey: ['rawValidatorData'],
        queryFn: () => fetchValidator(),
    });

    const { data: lastBlock } = useQuery({
        queryKey: ['lastBlockData'],
        queryFn: () => getLastCommit(),
    });

    return (
        <Box m="20px" sx={{p: 3}}>
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to Namada Network"/>
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="200px"
                gap="20px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="8px"
                >
                    <StatBox
                        title={lastBlock?.last_commit?.height || 0}
                        subtitle="Latest Block Height"
                        icon={
                            <ViewAgendaOutlinedIcon
                                sx={{color: colors.blueAccent[600], fontSize: "40px"}}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="8px"
                >
                    <StatBox
                        title={moment(lastBlock?.header?.time).format(
                            'DD MMM YYYY, HH:MM:SS',
                        )}
                        subtitle="Latest Block Time"
                        icon={
                            <UpdateOutlinedIcon
                                sx={{color: colors.blueAccent[600], fontSize: "40px"}}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="8px"
                >
                    <StatBox
                        title="shielded-expedition.88f17d1d14"
                        subtitle="Network"
                        icon={
                            <HubOutlinedIcon
                                sx={{color: colors.blueAccent[600], fontSize: "40px"}}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="8px"
                >
                    <StatBox
                        title={(rawValidatorData?.validators?.length || 0).toString()}
                        subtitle="Validators"
                        icon={
                            <HowToRegOutlinedIcon
                                sx={{color: colors.blueAccent[600], fontSize: "40px"}}
                            />
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;