import * as React from "react";
import { useQuery } from "react-query";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const RenderCIJobNameSelector = ({ jobName, setJobName, items }) => {
    const handleChange = (event) => {
        setJobName(event.target.value);
    };

    return (
        <>
        <FormControl style={{minWidth: 180}}>
            <InputLabel id="jobName-label">jobName</InputLabel>
            <Select
            labelId="jobName-label"
            id="jobName"
            value={jobName}
            label="jobName"
            onChange={handleChange}
            >
                {items.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>
        </>
  );
};

export const CIJobNameSelector = ({jobName, setJobName}) => {    
    const { isLoading, error, data } = useQuery("CIJobNameSelector", () => {
        return fetch("http://172.16.5.15:30792/report/jobname")
        .then((res) => {
            const data = res.json();
            // console.log(data);
            return data;
        })
        .catch((e) => {
            console.log(e);
        });
    });
    // console.log(isLoading, error, data);
    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error.message}</p>;
    }
    // console.log(data);
    return (
        <RenderCIJobNameSelector jobName={jobName} setJobName={setJobName} items={data} />
    );
}
