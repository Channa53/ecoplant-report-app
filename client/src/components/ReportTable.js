import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import {TableRow, TableSortLabel} from "@mui/material";
import {useEffect, useMemo, useState, useRef} from "react";
import {getComparator} from "./utils";

const ROWS_PER_PAGE = 20;
/**
 * ReportTable component - render sortable table of data.
 * Table structure: [timestamp, kwh, pressure. temp]
 */
export const ReportTable = ({data}) => {
    // column name to sort data by
    const [orderBy, setOrderBy] = useState("timestamp");
    // order type - asc/desc
    const [orderType, setOrderType] = useState("asc");
    // recent page that has been loaded to table
    const [page, setPage] = useState(1);

    // table column names
    const tableHead = Object.keys(data[0]);

    /**
     * create and set intersection observer for infinite scroller
     */
    const observerTarget = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(p => p + 1);
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget]);

    /**
     * handleSort - callback to handle clicking on one of the table head columns
     */
    const handleSort = (id) => {
        const isAsc = orderBy === id && orderType === 'asc';
        setOrderType(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    }

    /**
     * prepare data for rendering - sort by sort state and slice by page state
     */
    const sortedData = useMemo(() => {
        return data
            .sort(getComparator(orderType, orderBy))
            .slice(0, ROWS_PER_PAGE * page);
    }, [orderBy, orderType, data, page]);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {tableHead.map((headCell) => (
                            <TableCell
                                key={headCell}
                                sortDirection={orderBy === headCell ? orderType : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell}
                                    direction={orderBy === headCell ? orderType : 'asc'}
                                    onClick={() => handleSort(headCell)}
                                >
                                    {headCell}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((row, index) => {
                        return (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={index}
                                sx={{cursor: 'pointer'}}
                            >
                                <TableCell>{row.timestamp}</TableCell>
                                <TableCell>{row.kwh}</TableCell>
                                <TableCell>{row.pressure}</TableCell>
                                <TableCell>{row.temp}&deg;</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <div ref={observerTarget}></div>
        </TableContainer>
    );
}