import {Box, styled, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchLatestSignatureValidator, fetchValidator} from "../../services/validator";
import React, {useCallback, useMemo} from "react";
import Loader from "../../common/Loader";
import Tooltip, {tooltipClasses, TooltipProps} from '@mui/material/Tooltip';

export const ValidatorDetail = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const {validatorAddress} = useParams();

    const {
        data: rawValidatorData,
        error: rawError,
        isLoading: isLoadingRaw,
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

    const queryFunctionFetchLatestSig = useCallback(() => {
        if (!validatorAddress) throw new Error('Missing or wrong block id in url');
        return fetchLatestSignatureValidator(validatorAddress);
    }, [validatorAddress]);

    const {
        data: latestBlock,
        error: errorLatestBlock,
        isLoading: isLoadingLatestBlock,
    } = useQuery({
        queryKey: [`val-latest-${validatorAddress}`],
        queryFn: queryFunctionFetchLatestSig,
    });

    const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(16),
            border: '1px solid #dadde9',
        },
    }));

    return (
        <>
            {rawError || !validator ? (
                <Box m={"20px"} sx={{p: 3, ml: 3, fontSize: 16}}>
                    Not Found Validator Detail
                </Box>
            ) : (
                <>
                    {
                        isLoadingRaw ? (
                            <Box>
                                <Loader/>
                            </Box>
                        ) : (
                            <Box m="20px" sx={{p: 3}} display="flex" flexDirection={"column"}>
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
                                            <Typography variant="h5" color={`${colors.grey[300]}`}>Validator
                                                Address</Typography>
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
                                            <Typography variant="h5" color={`${colors.grey[300]}`}>Voting
                                                Power</Typography>
                                            <Typography variant="h5" sx={{
                                                lineHeight: 1.75,
                                                fontWeight: 600
                                            }}>{validator?.tokens || 0} NAM</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" color={`${colors.grey[300]}`}>Voting
                                                Percentage</Typography>
                                            <Typography variant="h5" sx={{
                                                lineHeight: 1.75,
                                                fontWeight: 600
                                            }}>{validator?.voting_power_percent || 0}%</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" color={`${colors.grey[300]}`}>Operator
                                                Address</Typography>
                                            <Typography variant="h5" sx={{lineHeight: 1.75, fontWeight: 600}}
                                                        autoCapitalize="true">{validator?.operator_address || ''}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display={"flex"} flexDirection={"row"}>
                                    <Box sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: '8px',
                                        backgroundColor: colors.primary[400]
                                    }}>
                                        {isLoadingLatestBlock ? (
                                            <Loader/>
                                        ) : errorLatestBlock ? (
                                            <Box mb={"16px"}>
                                                <Typography variant="h3" sx={{
                                                    lineHeight: 1.75,
                                                    fontWeight: 600,
                                                }}>Can't Fetch 100 Latest Blocks</Typography>
                                            </Box>
                                        ) : (
                                            <Box sx={{padding: '0 24px'}}>
                                                {/* ROW 1 */}
                                                <Box mb={"16px"}>
                                                    <Typography variant="h3" sx={{
                                                        lineHeight: 1.75,
                                                        fontWeight: 600,
                                                    }}>100 Signed Blocks</Typography>
                                                </Box>
                                                <Box mb={"16px"}>
                                                    {latestBlock?.length > 0 &&
                                                        latestBlock.map((item: any) => {
                                                            return (<HtmlTooltip
                                                                title={`Block Number: ${item?.block_number}`}
                                                                placement="right-start">
                                                                <Box
                                                                    sx={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        backgroundColor: item?.sign_status ? '#13deb9' : '#FA896B',
                                                                        borderRadius: '4px',
                                                                        margin: "4px",
                                                                        display: 'inline-block',
                                                                    }}
                                                                /></HtmlTooltip>)
                                                        })}
                                                </Box>
                                                <Box display={"flex"} pl={"4px"}>
                                                    <Box display={"flex"} justifyContent={"center"}
                                                         flexDirection={"row"}
                                                         mr={"32px"}>
                                                        <Box sx={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor: '#13deb9',
                                                            borderRadius: '4px',
                                                            mr: "8px"
                                                        }}></Box>
                                                        <Typography variant="h5">Signed
                                                            Blocks</Typography>
                                                    </Box>
                                                    <Box display={"flex"} justifyContent={"center"}
                                                         flexDirection={"row"}>
                                                        <Box sx={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor: '#FA896B',
                                                            borderRadius: '4px',
                                                            mr: "8px"
                                                        }}></Box>
                                                        <Typography variant="h5">
                                                            Missed Block</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>)}
                                    </Box>
                                </Box>
                            </Box>
                        )
                    }
                </>
            )}
        </>
    )
}