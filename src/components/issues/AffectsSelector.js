import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useMutation } from "react-query";
import axios from "axios";
import { url } from "../../utils";

export default function AffectsSelector({
  id,
  version = "master",
  affectsProp = "unknown",
  onChange = () => {},
}) {
  const mutation = useMutation((newAffect) => {
    return axios.post(url(`issue/${id}/affect/${version}`), newAffect);
  });
  const [affects, setAffects] = React.useState(affectsProp || "unknown");

  const handleChange = (event) => {
    mutation.mutate({
      issue_id: id,
      affect_version: version,
      affect_result: { unknown: "UnKnown", yes: "Yes", no: "No" }[
        event.target.value
      ],
    });
    onChange(event.target.value);
    setAffects(event.target.value);
  };

  return (
    <>
      {mutation.isLoading ? (
        <p>Updating...</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="affects"
              name="row-radio-buttons-group"
              value={affects}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="yes" />
              <FormControlLabel value="no" control={<Radio />} label="no" />
              <FormControlLabel
                value="unknown"
                control={<Radio />}
                label="unknown"
              />
            </RadioGroup>
          </FormControl>
        </>
      )}
    </>
  );
}
