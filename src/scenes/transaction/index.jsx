import {Box, Chip, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useCallback, useState} from "react";
import {SHOW_RECORD_TABLE_OPTION, TRANSACTION_ENDPOINT, TRANSACTION_ROUTER} from "../../constant";
import {useQuery} from "@tanstack/react-query";
import {fetchTransaction} from "../../services/transactions";
import {hiddenBlockId} from "../../utils";
import {Table} from "../../components/Table";
import Loader from "../../common/Loader";

const Transaction = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(() => {
        const pageIndexRaw = Number(searchParams.get('page') || '');
        const index = pageIndexRaw > 0 ? pageIndexRaw : 0;

        const pageSizeRaw = Number(searchParams.get('size') || '');
        const pageSize =
            pageSizeRaw > 0 && SHOW_RECORD_TABLE_OPTION.includes(pageSizeRaw)
                ? pageSizeRaw
                : 10;
        return {
            index,
            pageSize,
        };
    });
    const navigate = useNavigate();

    const {
        data: transactionsData,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['transactionData', page],
        queryFn: () => fetchTransaction(page.index, page.pageSize),
    });
    const rows = transactionsData?.data?.length > 0 ? transactionsData.data : [];

    if (error) {
        return <div>Can't Query Transaction</div>;
    }

    const columns: GridColDef[] = [
        {
            field: 'hash',
            headerName: 'Transaction Hash',
            headerClassName: 'header-cell-first',
            headerAlign: 'left',
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
                            navigate(`/${TRANSACTION_ROUTER}/${params?.value}`)
                        }
                    >
                        {hiddenBlockId(params?.value || '')}
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
            field: 'tx_type',
            headerName: 'Type type',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return <div className="cell-table-page" style={{fontSize: "16px"}}>{params?.value}</div>;
            },
        },
        {
            field: 'tx',
            headerName: 'Status',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="cell-table-page">
                        {params?.value ?
                            <Chip label="Success" color="default" variant="filled" size="small" sx={{
                                p: 1,
                                fontSize: '16px',
                                backgroundColor: colors.greenAccent[200],
                                color: colors.greenAccent[500]
                            }}/>
                            :
                            <Chip label="Failed" color="default" variant="filled" size="small"
                                  sx={{p: 1, fontSize: '16px',
                                      backgroundColor: colors.redAccent[200],
                                      color: colors.redAccent[500]
                            }}/>}
                    </div>
                );
            },
            width: 30,
        },
        {
            field: 'fee_amount_per_gas_unit',
            headerName: 'Gas used',
            headerAlign: 'left',
            headerClassName: 'header-cell-last',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return <div className="cell-table-page" style={{fontSize: "16px"}}>{params?.value ?? ''}</div>;
            },
        },
    ];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onPageChange = useCallback((newPage: number) => {
        setPage((prev) => {
            navigate(`/${TRANSACTION_ENDPOINT}?page=${newPage}&size=${prev.pageSize}`, {
                replace: true,
            });
            return {...prev, index: newPage};
        });
    }, [navigate]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onPageSizeChange = useCallback((newPageSize: number) => {
        setPage((prev) => {
            navigate(`/${TRANSACTION_ENDPOINT}?page=${prev.index}&size=${newPageSize}`, {
                replace: true,
            });
            return {...prev, pageSize: newPageSize};
        });
    }, [navigate]);

    if (isLoading) return <Loader/>;

    return (
        <Box m="20px" sx={{p: 3}}>
            <Header title="Transactions" subtitle=""/>
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
                <div className="transaction-page">
                    <Table
                        rows={rows}
                        columns={columns}
                        isLoading={isLoading}
                        pageDetail={page}
                        onPageSizeChange={onPageSizeChange}
                        onPageChange={onPageChange}
                        rowCount={transactionsData?.total || 0}
                        paginationMode="server"
                    />
                </div>
            </Box>
        </Box>
    );
};

export default Transaction;