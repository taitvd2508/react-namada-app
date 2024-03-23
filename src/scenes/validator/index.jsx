import {Box, Chip, useTheme} from "@mui/material";
import {GridColDef} from "@mui/x-data-grid";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import {SHOW_RECORD_TABLE_OPTION, VALIDATOR_ENDPOINT, VALIDATOR_ROUTER} from "../../constant";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useCallback, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchPartValidator, fetchValidator} from "../../services/validator";
import {Table} from "../../components/Table";
import {formatNumber, hiddenBlockId} from "../../utils";
import Loader from "../../common/Loader";

const Validator = () => {
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

    const {
        data: rawValidatorData,
        error: rawError,
        isLoading: isLoadingRaw,
    } = useQuery({
        queryKey: ['rawValidatorData'],
        queryFn: () => fetchValidator(),
    });

    const {
        data: validatorData,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['validatorData', rawValidatorData, page],
        queryFn: () => fetchPartValidator(rawValidatorData, page),
    });

    const rows = validatorData?.length > 0 ? validatorData : [];

    if (error || rawError) {
        return <div>Can't Query Validator</div>;
    }

    const columns: GridColDef[] = [
        {
            field: 'hex_address',
            headerName: 'Validator address',
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
                        onClick={() => navigate(`/${VALIDATOR_ROUTER}/${params?.value}`)}
                    >
                        {hiddenBlockId(params?.value || '')}
                    </div>
                );
            },
        },
        {
            field: 'moniker',
            headerName: 'Moniker',
            headerClassName: 'header-cell-first',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return <div className="cell-table-page">{params?.value || ''}</div>;
            },
        },
        {
            field: 'operator_address',
            headerName: 'Operator address',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="cell-table-page">
                        {hiddenBlockId(params?.value || '', 18, true)}
                    </div>
                );
            },
        },
        {
            field: 'tokens',
            headerName: 'Voting power',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: (params) => (
                <div className="cell-table-page">
                    {formatNumber(params?.value / 1_000_000)} NAM
                </div>
            ),
        },
        {
            field: 'signBlock',
            headerName: 'Commit Signature',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => (
                <div className="cell-table-page">{params?.value || 0}</div>
            ),
        },
        {
            field: 'voting_power_percent',
            headerName: 'Voting Percentage',
            headerAlign: 'center',
            align: 'center',
            headerClassName: 'header-cell-last',
            flex: 1,
            renderCell: (params) => {
                const fixedValue =
                    typeof params?.value === 'number' ? params.value.toFixed(2) : '';
                return <div className="cell-table-page">
                    <Chip label={`${fixedValue} %`} color="default" variant="filled" size="small"
                          sx={{
                              p: 1, fontSize: '16px',
                              backgroundColor: colors.yellowAccent[200],
                              color: colors.yellowAccent[700]
                          }}
                    />
                </div>;
            },
        },
    ];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onPageChange = useCallback((newPage: number) => {
        setPage((prev) => {
            navigate(`/${VALIDATOR_ENDPOINT}?page=${newPage}&size=${prev.pageSize}`, {
                replace: true,
            });
            return {...prev, index: newPage};
        });
    }, [navigate]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onPageSizeChange = useCallback((newPageSize: number) => {
        setPage((prev) => {
            navigate(`/${VALIDATOR_ENDPOINT}?page=${prev.index}&size=${newPageSize}`, {
                replace: true,
            });
            return {...prev, pageSize: newPageSize};
        });
    }, [navigate]);

    if (isLoading) return <Loader/>;

    return (
        <Box m="20px" sx={{p: 3}}>

            <Header
                title="Validators"
                subtitle=""
            />
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
                    isLoading={isLoadingRaw || isLoading}
                    pageDetail={page}
                    onPageSizeChange={onPageSizeChange}
                    onPageChange={onPageChange}
                    rowCount={rawValidatorData?.validators?.length || 0}
                    paginationMode="server"
                />
            </Box>
        </Box>
    );
};

export default Validator;