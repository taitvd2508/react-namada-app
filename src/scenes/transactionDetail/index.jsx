import {useParams} from "react-router-dom";
import {useCallback} from "react";
import {fetchDetailBlockByBlockHash} from "../../services/block";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../common/Loader";
import moment from "moment";
import {Box, CardContent, Chip, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {fetchDetailTransaction} from "../../services/transactions";

export const TransactionDetail = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const {tx} = useParams();

    const queryFunctionFetchDetail = useCallback(() => {
        if (!tx) throw new Error('Missing or wrong txh in url');
        return fetchDetailTransaction(tx);
    }, [tx]);

    const {
        data: detailTransactionData,
        error,
        isLoading,
    } = useQuery({
        queryKey: [`tx-${tx}`],
        queryFn: queryFunctionFetchDetail,
    });

    const queryFunctionFetchDetailBlock = useCallback(() => {
        if (!isLoading) {
            const blockId = detailTransactionData?.block_id;
            if (!blockId) throw new Error('Missing or wrong block id in url');
            return fetchDetailBlockByBlockHash(blockId);
        }
    }, [detailTransactionData?.block_id, isLoading]);

    const {
        data: detailBlockHash,
        isLoading: isLoadingBlock,
    } = useQuery({
        queryKey: [`block-hash-${detailTransactionData?.block_id}`],
        queryFn: queryFunctionFetchDetailBlock,
    });

    if (isLoading || isLoadingBlock) return <Loader/>;

    return (
        <>
            {error || !detailTransactionData ? (
                <Box  m={"20px"} sx={{p: 3, ml: 3, fontSize: 16}}>
                    Not Found Transaction Detail
                </Box>
            ) : (
                <Box m="20px" sx={{p: 3}}>
                    <Box sx={{
                        p: 2,
                        borderRadius: '8px',
                        backgroundColor: colors.primary[400]
                    }}>
                        <Box sx={{padding: '0 24px'}}>
                            <Typography variant="h3" sx={{color: `${colors.blueAccent[400]}`}}>Transaction
                                Overview</Typography>
                        </Box>
                        <Box sx={{p: 3}}>
                            <Typography variant="h5" color={`${colors.grey[300]}`}>Transaction Hash</Typography>
                            <Typography variant="h5" sx={{
                                lineHeight: 1.75,
                                fontWeight: 600
                            }}>{detailTransactionData?.hash || ''}</Typography>
                        </Box>
                        <Box display="grid"
                             gridTemplateColumns="repeat(3, 1fr)"
                             gap="40px"
                             boxSizing="border-box"
                             padding="24px"
                        >
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Block Height</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}># {detailBlockHash?.header?.height}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Gas Used</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{detailTransactionData?.gas_limit_multiplier ?? 0}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Status</Typography>
                                {detailTransactionData?.return_code ?
                                    <Chip label="Success" color="default" variant="filled" size="small" sx={{
                                        p: 1,
                                        fontSize: '16px',
                                        backgroundColor: colors.greenAccent[200],
                                        color: colors.greenAccent[500]
                                    }}/>
                                    :
                                    <Chip label="Failed" color="default" variant="filled" size="small"
                                          sx={{
                                              p: 1, fontSize: '16px',
                                              backgroundColor: colors.redAccent[200],
                                              color: colors.redAccent[500]
                                          }}/>}
                            </Box>

                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Transaction Type</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{detailTransactionData?.tx_type ?? ''}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Time</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{moment(detailBlockHash?.header?.time).format(
                                    'DD MMM YYYY hh:mm:ss',
                                )}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Fee</Typography>
                                <Typography variant="h5" sx={{lineHeight: 1.75, fontWeight: 600}}
                                            autoCapitalize="true">{detailTransactionData?.fee_amount_per_gas_unit || 0}{' '}
                                    NAM</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        m="40px 0 0 0"
                        style={{borderRadius: 8}}
                        sx={{
                            p: 2,
                            borderRadius: '8px',
                            backgroundColor: colors.primary[400]
                        }}
                    >
                        <Box sx={{padding: '0 24px'}}>
                            <Typography variant="h3" sx={{color: `${colors.blueAccent[400]}`}}>
                                Raw Data</Typography>
                        </Box>
                        <Box sx={{p: 1}}>
                            <CardContent>
                                <Box style={{flexWrap: "wrap", wordBreak: "break-word"}}>
                                    {JSON.stringify(detailTransactionData, undefined, 2)}
                                </Box>
                            </CardContent>

                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
}