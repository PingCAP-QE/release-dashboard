import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const VersionSearch = () => {
    const handleApplyChanges = React.useCallback(() => {
    }, []);

    return (
    <FormGroup row spacing={2}>
        <FormControl variant="standard">
            <TextField id="outlined-basic" label="Name" variant="outlined" />
        </FormControl>
        <FormControl variant="standard">
            <TextField id="outlined-basic" label="Type" variant="outlined" /> 
        </FormControl>
        <FormControl variant="standard">
            <TextField id="outlined-basic" label="Status" variant="outlined" />
        </FormControl>
        <Button variant="contained" onClick={handleApplyChanges}>Query</Button>
    </FormGroup>
    );
}
