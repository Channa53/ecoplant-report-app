import {useState} from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "./ReportFilters.css";

/**
 * ReportFilters component - show date picker to filter content and parse result to parent component.
 */
export const ReportFilters = ({onChange}) => {
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const handleFromChange = (value) => {
        setFrom(Date.parse(value.format()));
        onChange(Date.parse(value.format()), to);
    }

    const handleToChange = (value) => {
        setTo(Date.parse(value.format()));
        onChange(from, Date.parse(value.format()));
    }

    return <div className={"filter-wrapper"}>
        <h2 className={"filter__title"}>Search report by date: </h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <span className={"filter__from"}>
                <DatePicker label="From" onChange={handleFromChange}/>
            </span>
            <DatePicker label="To" onChange={handleToChange} />
        </LocalizationProvider>
    </div>
}