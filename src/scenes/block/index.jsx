import {GridColDef} from "@mui/x-data-grid";
import {useNavigate, useSearchParams} from "react-router-dom";
import {hiddenBlockId} from "../../utils";
import {BLOCK_ROUTER, SHOW_RECORD_TABLE_OPTION} from "../../constant";
import moment from "moment"
import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";
import {Table} from "../../components/Table";
import {fetchBlock} from "../../services/block";
import {Box, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import Loader from "../../common/Loader";

const Block = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(() => {
        const pageIndexRaw = Number(searchParams.get('page') || '');
        const index = pageIndexRaw > 0 ? pageIndexRaw : 0;

        const pageSizeRaw = Number(searchParams.get('size') || '');
        const pageSize = pageSizeRaw > 0 && SHOW_RECORD_TABLE_OPTION.includes(pageSizeRaw) ? pageSizeRaw : 10;
        return {
            index,
            pageSize,
        };
    });

    const {
        data: blockData,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['blockData', page],
        queryFn: () => fetchBlock(page.index, page.pageSize),
    });

    const rows = blockData?.data?.length > 0 ? blockData.data : [];

    const navigate = useNavigate();

    const onPageChange = useCallback((newPage: number) => {
        setPage((prev) => {
            navigate(`/${BLOCK_ROUTER}?page=${newPage}&size=${prev.pageSize}`, {
                replace: true,
            });
            return {...prev, index: newPage};
        });
    }, [navigate]);

    const onPageSizeChange = useCallback((newPageSize: number) => {
        setPage((prev) => {
            navigate(`/${BLOCK_ROUTER}?page=${prev.index}&size=${newPageSize}`, {
                replace: true,
            });
            return {...prev, pageSize: newPageSize};
        });
    }, [navigate]);

    const columns: GridColDef[] = [
        {
            field: 'height',
            headerName: 'Block Height',
            headerAlign: 'left',
            headerClassName: 'header-cell-first',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div
                        className="cell-table-page cursor-pointer underline"
                        style={{
                            color: colors.blueAccent[400],
                            textDecoration: 'underline',
                            fontSize: '16px',
                            fontWeight: 600
                        }}
                        onClick={() =>
                            navigate(`/${BLOCK_ROUTER}/${params?.row?.header?.height}`)
                        }
                    >
                        # {params?.row?.header?.height ?? ''}
                    </div>
                );
            },
        },
        {
            field: 'block_id',
            headerName: 'Block ID',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => (
                <div className="cell-table-page" style={{fontSize: "16px"}}>
                    {hiddenBlockId(params?.value || '')}
                </div>
            ),
        },
        {
            field: 'proposer',
            headerName: 'Proposer Address',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="cell-table-page" style={{fontSize: "16px"}}>
                        {hiddenBlockId(params?.row?.header?.proposer_address, 16)}
                    </div>
                );
            },
        },
        {
            field: 'txs',
            headerName: 'Transactions',
            type: "number",
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="cell-table-page" style={{fontSize: "16px"}}>
                        {params?.row?.tx_hashes?.length ?? ''}
                    </div>
                );
            },
            width: 30,
        },
        {
            field: 'time',
            headerName: 'Time',
            headerAlign: 'left',
            headerClassName: 'header-cell-last',
            align: 'left',
            flex: 1,
            renderCell: (params) => (
                <div className="cell-table-page" style={{fontSize: "16px"}}>
                    {moment(params?.row?.header?.time).fromNow()}
                </div>
            ),
            width: 50,
        },
    ];

    if (isLoading) return <Loader/>;

    if (error) {
        return <div>Can't Query Block</div>;
    }

    return (
        <Box m="20px" sx={{p: 3}}>
            <Header title="Blocks" subtitle=""/>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.primary[400],
                        borderBottom: "none",
                        borderTopRightRadius: "8px",
                        borderTopLeftRadius: "8px"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.primary[400],
                        borderBottomRightRadius: "8px",
                        borderBottomLeftRadius: "8px"
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <Table
                    rows={rows}
                    columns={columns}
                    isLoading={isLoading}
                    pageDetail={page}
                    onPageSizeChange={onPageSizeChange}
                    onPageChange={onPageChange}
                    rowCount={blockData?.total || 0}
                    paginationMode="server"
                />
            </Box>
        </Box>
    );
};

export default Block;