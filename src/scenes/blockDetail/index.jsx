import {useParams} from "react-router-dom";
import {useCallback, useState} from "react";
import {fetchDetailBlockByBlockHeight} from "../../services/block";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../common/Loader";
import {hiddenBlockId} from "../../utils";
import moment from "moment";
import {Table} from "../../components/Table";
import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import {GridColDef} from "@mui/x-data-grid";

export const BlockDetail = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const {blockHeight} = useParams();

    const queryFunctionFetchDetail = useCallback(() => {
        const numberBlockHeight = Number(blockHeight);
        if (!numberBlockHeight || numberBlockHeight < 0)
            throw new Error('Missing or wrong block height in url');
        return fetchDetailBlockByBlockHeight(numberBlockHeight);
    }, [blockHeight]);

    const {
        data: detailBlockData,
        error,
        isLoading,
    } = useQuery({
        queryKey: [`block-${blockHeight}`],
        queryFn: queryFunctionFetchDetail,
    });

    const [page, setPage] = useState(() => {
        return {
            index: 0,
            pageSize: 10,
        };
    });

    const onPageChange = useCallback((newPage: number) => {
        setPage((prev) => {
            return {...prev, index: newPage};
        });
    }, []);

    const onPageSizeChange = useCallback((newPageSize: number) => {
        setPage((prev) => {
            return {...prev, pageSize: newPageSize};
        });
    }, []);

    if (isLoading) return <Loader/>;

    const columns: GridColDef[] = [
        {
            field: 'height',
            headerName: 'Block Height',
            headerAlign: 'left',
            headerClassName: 'header-cell-first',
            align: 'left',
            flex: 1,
            renderCell: () => {
                return (
                    <div
                        className="cell-table-page cursor-pointer underline"
                        style={{fontWeight: 600}}
                    >
                        # {detailBlockData?.header?.height}
                    </div>
                );
            },
        },
        {
            field: 'hash_id',
            headerName: 'Block ID',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => (
                <div className="cell-table-page">
                    {hiddenBlockId(params?.value || '')}
                </div>
            ),
        },
        {
            field: 'tx_type',
            headerName: 'Transaction type',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return <div className="cell-table-page">{params?.value ?? ''}</div>;
            },
        },
        {
            field: 'time',
            headerName: 'Time',
            headerAlign: 'right',
            headerClassName: 'header-cell-last',
            align: 'right',
            flex: 1,
            renderCell: () => (
                <div className="cell-table-page">
                    {moment(detailBlockData?.header?.time).fromNow()}
                </div>
            ),
            width: 50,
        },
    ];

    return (
        <>
            {error || !detailBlockData ? (
                <Box m={"20px"} sx={{p: 3, ml: 3, fontSize: 16}}>
                    Not Found Block Detail
                </Box>
            ) : (
                <Box m="20px" sx={{p: 3}}>
                    <Box sx={{p: 2, borderRadius: '8px', backgroundColor: colors.primary[400]}}>
                        <Box sx={{padding: '0 24px'}}>
                            <Typography variant="h3" sx={{color: `${colors.blueAccent[400]}`}}>Block Overview</Typography>
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
                                }}># {detailBlockData?.header?.height}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Transactions</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{detailBlockData?.tx_hashes?.length || 0}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Time</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{moment(detailBlockData?.header?.time).format(
                                    'DD MMM YYYY hh:mm:ss',
                                )}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Block Hash</Typography>
                                <Typography variant="h5" sx={{
                                    lineHeight: 1.75,
                                    fontWeight: 600
                                }}>{detailBlockData?.block_id || ''}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h5" color={`${colors.grey[300]}`}>Proposer</Typography>
                                <Typography variant="h5" sx={{lineHeight: 1.75, fontWeight: 600}}
                                            autoCapitalize="true">{detailBlockData?.header?.proposer_address}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        m="40px 0 0 0"
                        style={{borderRadius: 8}}
                    >
                        <Table
                            rows={detailBlockData?.tx_hashes || []}
                            columns={columns}
                            isLoading={isLoading}
                            pageDetail={page}
                            onPageSizeChange={onPageSizeChange}
                            onPageChange={onPageChange}
                            rowCount={detailBlockData?.tx_hashes?.length || 0}
                            minHeight="auto"
                        />
                    </Box>
                </Box>
            )}
        </>
    );
}