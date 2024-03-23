import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchLatestSignatureValidator, fetchValidator} from "../../services/validator";
import {useCallback, useMemo} from "react";

export const ValidatorDetail = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const {validatorAddress} = useParams();

    const {
        data: rawValidatorData,
        error: rawError,
    } = useQuery({
        queryKey: ['rawValidatorData'],
        queryFn: () => fetchValidator(),
    });

    const validator = useMemo(() => {
        if (
            !validatorAddress ||
            !(rawValidatorData?.validators?.length > 0)
        )
            return null;
        return rawValidatorData?.validators.find(
            (val: any) => val.hex_address === validatorAddress,
        );
    }, [rawValidatorData?.validators, validatorAddress]);

    useCallback(() => {
        if (!validatorAddress) throw new Error('Missing or wrong block id in url');
        return fetchLatestSignatureValidator(validatorAddress);
    }, [validatorAddress]);

    return (
        <>
            {rawError || !validator ? (
                <Box m={"20px"} sx={{p: 3, ml: 3, fontSize: 16}}>
                    Not Found Validator Detail
                </Box>
            ) : (
                <Box m="20px" sx={{p: 3}}>
                    <Box sx={{
                        p: 2,
                        borderRadius: '8px',
                        backgroundColor: colors.primary[400]
                    }}>
                        <Box sx={{padding: '0 24px'}}>
                            <Typography variant="h3" sx={{color: `${colors.blueAccent[400]}`}}>Validator
                                Overview</Typography>
                        </Box>
                        <Box display="grid"
                             gridTemplateColumns="repeat(2, 1fr)"
                             gap="40px"
                             boxSizing="border-box"
                             padding="24px"
                        >
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Validator Address</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{validator?.hex_address || ''}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Moniker</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{validator?.moniker || ''}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Voting Power</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{validator?.tokens || 0} NAM</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Voting Percentage</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{validator?.voting_power_percent || 0}%</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Operator Address</Typography>
                                <Typography variant="h5" sx={{lineHeight: 1.75, fontWeight: 600}}
                                            autoCapitalize="true">{validator?.operator_address || ''}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    )
}