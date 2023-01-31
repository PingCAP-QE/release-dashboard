import { MenuItem, Select } from "@mui/material";
import * as React from 'react';
import { useState } from "react";
import { useMutation } from "react-query";
import FormControl from "@mui/material/FormControl";
import * as axios from "axios";
import { url } from "../../../utils";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const BlockReleaseSelect = ({ row }) => {
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [blocked, setBlocked] = useState(
    row.version_triage.block_version_release || "-"
  );
  const mutation = useMutation(async (blocked) => {
    await axios.patch(url("version_triage"), {
      ...row.version_triage,
      block_version_release: blocked,
    });
  });

  const handleClose = () => {
    setShowSnackBar(false)
  };

  const confirmCancelBlock = () => {
    mutation.mutate("None Block");
    setBlocked("None Block");
    row.version_triage.block_version_release = "None Block";
    setShowSnackBar(false)
  }

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackBar}
      >
        <Alert onClose={handleClose} severity="warning">
          Only Release Manager can cancel the block value.<br />
          Do you want to continue?<br />
          <Button color="secondary" size="small" onClick={confirmCancelBlock}>
            Yes
          </Button>
          <Button color="secondary" size="small" onClick={handleClose}>
            No
          </Button>
        </Alert>
      </Snackbar>
      <Select
        value={blocked}
        onChange={(e) => {
          if (blocked == "Block" && e.target.value == "None Block") {
            setShowSnackBar(true)
          } else {
            mutation.mutate(e.target.value);
            setBlocked(e.target.value);
            row.version_triage.block_version_release = e.target.value;
          }
        }}
      >
        <MenuItem value="-" disabled={true}>-</MenuItem>
        <MenuItem value="Block">Block</MenuItem>
        <MenuItem value="None Block">None Block</MenuItem>
      </Select>
    </FormControl >
  );
};

export function renderBlockRelease({ row }) {
  return <BlockReleaseSelect row={row} />;
}
