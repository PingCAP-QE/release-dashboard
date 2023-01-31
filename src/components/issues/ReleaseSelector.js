import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

const getStyle = (status) => {
  switch (status) {
    case "accept":
      return { color: "green", fontWeight: "bold" };
    case "won't-fix":
      return { color: "red", fontWeight: "bold" };
    case "released":
      return { color: "green", fontWeight: "" };
    case "later":
      return { color: "orange", fontWeight: "bold" };
    default:
      return {};
  }
};

const ReleaseSelector = ({ releaseProp, onChange }) => {
  const [release, setRelease] = React.useState(
    releaseProp.TriageStatus || "unknown"
  );

  const handleChange = (event) => {
    setRelease(event.target.value);
    onChange(event.target.value);
  };

  const items = ["accept", "won't-fix", "later", "released"];

  return (
    <>
      <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
        {releaseProp.Patch && (
          <FormHelperText>
            For {releaseProp.BaseVersion}.{releaseProp.Patch}
          </FormHelperText>
        )}
        <Select
          value={release}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={getStyle(release)}
        >
          <MenuItem value="unknown">
            <em>unkown</em>
          </MenuItem>
          {items.map((item) => (
            <MenuItem value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default ReleaseSelector;
