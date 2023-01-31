import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const CIDatePicker = ({ timestamp, setTimestamp }) => {
    return (
        <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="from time (default to now)"
                value={timestamp}
                onChange={(newTime) => {
                    setTimestamp(newTime);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        </>
    )
}