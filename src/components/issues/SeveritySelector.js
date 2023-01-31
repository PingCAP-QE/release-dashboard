import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function getStyleBySeverity(severity) {
  switch (severity) {
    case "critical":
      return { color: "red", fontWeight: "bold" };
    case "major":
      return { color: "red" };
    case "moderate" | "minor":
      return { color: "black" };
    default:
      return { color: "black" };
  }
}

export default function SeveritySelector(
  { severityProp } = { severityProp: "" }
) {
  const [severity, setSeverity] = React.useState(severityProp);

  const handleChange = (event) => {
    setSeverity(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
        <Select
          value={severity}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{ ...getStyleBySeverity(severity) }}
        >
          <MenuItem value="">
            <em>unkown</em>
          </MenuItem>
          <MenuItem value={"minor"}>minor</MenuItem>
          <MenuItem value={"moderate"}>moderate</MenuItem>
          <MenuItem value={"major"}>major</MenuItem>
          <MenuItem value={"critical"}>critical</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
