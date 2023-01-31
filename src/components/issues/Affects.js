import Button from "@mui/material/Button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Chip,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AffectsSelector from "./AffectsSelector";
import { useState } from "react";
import ReleaseSelector from "./ReleaseSelector";

import * as React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function ToggleButtons({ onExpand, onShow }) {
  const [buttonState, setButtonState] = React.useState([]);

  const handleChange = (event, change) => {
    setButtonState(change);
    console.log(event, change);
    onExpand(change.includes("expand"));
    onShow(change.includes("show"));
  };

  return (
    <ToggleButtonGroup
      size="small"
      value={buttonState}
      onChange={handleChange}
      aria-label="list state"
    >
      <ToggleButton value="expand" aria-label="expand">
        <ExpandMoreIcon />
      </ToggleButton>
      <ToggleButton value="show" aria-label="show">
        <VisibilityIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default function Affects(
  { id, affectsProp, expandProp, showProp, onlyVersion, columns } = {
    expandProp: false,
    showProp: false,
  }
) {
  const [showNotAffect, setShowNotAffect] = useState(showProp);
  const [expand, setExpand] = useState(expandProp);
  const [affects, setAffects] = useState(
    onlyVersion
      ? affectsProp.filter((item) => item.Version.toLowerCase() === onlyVersion)
      : affectsProp
  );

  const unknown = affects
    .filter(({ Affect }) => Affect.toLowerCase() === "unknown")
    .map(({ Version }) => Version);
  const affected = affects
    .filter(({ Affect }) => Affect.toLowerCase() === "yes")
    .map(({ Version }) => Version);
  const notAffected = affects
    .filter(({ Affect }) => Affect.toLowerCase() === "no")
    .map(({ Version }) => Version);
  return (
    <div>
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        {!onlyVersion && (
          <ToggleButtons
            onExpand={(expand) => {
              setExpand(expand);
            }}
            onShow={(show) => {
              setShowNotAffect(show);
            }}
          ></ToggleButtons>
        )}
        {!expand && (
          <>
            {affected.map((version) => {
              console.log(version);
              return <Chip label={"" + version} color="error" />;
            })}
            {unknown.map((version) => {
              console.log(version);
              return (
                <Chip label={"" + version} variant="outlined" color="error" />
              );
            })}
            {showNotAffect &&
              notAffected.map((version) => {
                console.log(version);
                return (
                  <Chip
                    label={"" + version}
                    variant="outlined"
                    color="success"
                  />
                );
              })}
          </>
        )}
      </Stack>

      {expand && (
        <Stack alignItems={"flex-start"} spacing={1}>
          {/* <TableContainer component={Paper}> */}
          <Table sx={{ minWidth: 150 * columns.length }} size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => {
                  if (column.display) {
                    return (
                      <TableCell key={column.title}>{column.title}</TableCell>
                    );
                  }
                  return <></>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {affects
                .filter((item) => {
                  if (showNotAffect && item.Affect.toLowerCase() === "no") {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                  return (
                    <TableRow
                      key={item.Version}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      {columns.map((column) => {
                        if (column.display) {
                          switch (column.title) {
                            case "Version":
                              return (
                                <TableCell>
                                  <Chip
                                    label={item.Version}
                                    color={
                                      item.Affect.toLowerCase() !== "no"
                                        ? "error"
                                        : "success"
                                    }
                                    variant={
                                      item.Affect.toLowerCase() !== "yes"
                                        ? "outlined"
                                        : "filled"
                                    }
                                  />
                                </TableCell>
                              );
                            case "Affects":
                              return (
                                <TableCell>
                                  <AffectsSelector
                                    id={id}
                                    version={item.Version}
                                    affectsProp={item.Affect.toLowerCase()}
                                    onChange={(targetValue) => {
                                      setAffects([
                                        ...affects.map(
                                          ({ Version, Affect, ...rest }) => {
                                            if (Version === item.Version) {
                                              return {
                                                Version,
                                                Affect: targetValue,
                                                ...rest,
                                              };
                                            }
                                            return { Version, Affect, ...rest };
                                          }
                                        ),
                                      ]);
                                    }}
                                  ></AffectsSelector>
                                </TableCell>
                              );
                            case "PR":
                              return (
                                <TableCell>
                                  {item.PR && (
                                    <Link href={item.PR.Url}>
                                      {item.PR.Number}
                                    </Link>
                                  )}
                                </TableCell>
                              );
                            case "State":
                              return (
                                <TableCell>
                                  {item.pr && item.pr.State}
                                </TableCell>
                              );
                            case "Release":
                              return (
                                <TableCell>
                                  {item.Release && (
                                    <ReleaseSelector
                                      releaseProp={item.Release}
                                      onChange={(triageStatus) => {
                                        setAffects([
                                          ...affects.map(
                                            ({ version, Release, ...rest }) => {
                                              if (version === item.version) {
                                                return {
                                                  version,
                                                  Release: {
                                                    ...Release,
                                                    TriageStatus: triageStatus,
                                                  },
                                                  ...rest,
                                                };
                                              }
                                              return {
                                                version,
                                                Release,
                                                ...rest,
                                              };
                                            }
                                          ),
                                        ]);
                                      }}
                                    />
                                  )}
                                </TableCell>
                              );
                            default:
                              return <></>;
                          }
                        }
                        return <></>;
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {/* </TableContainer> */}
        </Stack>
      )}
    </div>
  );
}
