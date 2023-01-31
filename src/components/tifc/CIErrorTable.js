import * as React from "react";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import CIColumns from "./CIColumns";

function ToggleButtons({ onShow }) {
    const [buttonState, setButtonState] = React.useState([]);

    const handleChange = (event, change) => {
        setButtonState(change);
        // console.log(event, change);
        onShow(change.includes("show"));
    };

    return (
        <ToggleButtonGroup
        size="small"
        value={buttonState}
        onChange={handleChange}
        aria-label="list state"
        >
        <ToggleButton value="show" aria-label="show">
            <VisibilityIcon />
        </ToggleButton>
        </ToggleButtonGroup>
    );
}

const CIErrorRow = ({ row, columns }) => {
    return (
        <>
        <TableRow
            sx={{
                "&:last-child td, &:last-child th": { border: 0 },
            }}
        >
        {columns.map((column) => {
            if (column.display) {
            switch (column.title) {
                case "start_time":
                    return <TableCell>{row.start_time}</TableCell>;
                case "commit_id":
                    return <TableCell>{row.commit_id}</TableCell>;
                case "branch":
                    return <TableCell>{row.branch}</TableCell>;
                case "excution_time":
                    return <TableCell>{row.excution_time}</TableCell>;
                case "pull_request":
                    return <TableCell>{row.pull_request}</TableCell>;
                case "job_url":
                    return <TableCell>{row.job_url}</TableCell>;
                case "error_message":
                    return <TableCell>{row.error_message}</TableCell>;
                case "stack_trace":
                    return <TableCell>{row.stack_trace}</TableCell>;
                default:
                    return <></>;
            }
        }
        return <></>;
        })}
        </TableRow>
        </>
    );
};

  
export const CIErrorTable = ({
    data,
    columns = [
        CIColumns.recent_runs.columns.start_time,
        CIColumns.recent_runs.columns.commit_id,
        CIColumns.recent_runs.columns.branch,
        CIColumns.recent_runs.columns.excution_time,
        CIColumns.recent_runs.columns.pull_request,
        CIColumns.recent_runs.columns.job_url,
        CIColumns.recent_runs.columns.error_message,
        CIColumns.recent_runs.columns.stack_trace,
    ],
  }) => 
{
    // console.log(data, columns);

    const [show, setShow] = useState(false);

    return (
        <>
        <TableContainer component={Paper}>
            <ToggleButtons
                onShow={(show) => {
                    setShow(show);
                }}
            ></ToggleButtons>
            {show && (
                <Table sx={{ minWidth: 950 }} size="small">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => {
                        if (column.display) {
                            return <TableCell>{column.title}</TableCell>;
                        }
                        return <></>;
                    })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                    <CIErrorRow
                        row={row}
                        columns={columns}
                    />
                    ))}
                </TableBody>
                </Table>
            )}
            {!show && (
                <></>
            )}
        </TableContainer>
        </>
    );
};
