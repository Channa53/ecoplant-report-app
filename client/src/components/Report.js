import {useCallback, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {ReportTable} from "./ReportTable";
import {ReportFilters} from "./ReportFilters";

/**
 * Report component: get report from server and display the content as table with sorting and filtering options.
 */
export const Report = () => {
    const [reportData, setReportData] = useState([]);
    const [dateRange, setDateRange] = useState({from: null, to: null});

    /**
     * get data from server
     */
    useEffect(() => {
        axios
            .get("http://localhost:8080")
            .then(data => setReportData(data.data))
            .catch((err) => alert("failed to connect server " + err));
    }, []);

    /**
     * get filter values and store in state to re-render
     */
    const handleFilterChange = useCallback((from, to) => {
        setDateRange({from: from, to: to});
    }, [setDateRange]);

    /**
     * filter data by date range
     */
    const filteredData = useMemo(() => {
        if (dateRange.from && dateRange.to) {
            return reportData.filter((item) => {
                const itemDate = Date.parse(item.timestamp);
                return dateRange.from <= itemDate && itemDate <= dateRange.to;
            })
        }
        return reportData;
    }, [reportData, dateRange]);

    return <>
        <ReportFilters onChange={handleFilterChange}/>
        {filteredData?.length ? <ReportTable data={filteredData}/> : "no result..."}</>
}