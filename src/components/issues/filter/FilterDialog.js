import * as React from "react";
import { Checkbox, Dialog, MenuItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import { Stack, Table, TableBody, TableCell, TableRow } from "@mui/material";
import TiDialogTitle from "../../common/TiDialogTitle";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getVersionTriageValue } from "../renderer/PickTriage"
import { useSearchParams } from "react-router-dom";
import { createBrowserHistory } from "history";

export const stringify = (filter) =>
  (filter.stringify || ((filter) => filter))(filter);

const number = {
  id: "number",
  name: "Issue Number",
  data: {
    issueNumber: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }
    self.data.issueNumber = searchParams.get(self.id);
  },
  stringify: (self) => {
    return self.data.issueNumber ? `${self.id}=${self.data.issueNumber}` : "";
  },
  render: ({ data, update }) => {
    return (
      <TextField
        fullWidth
        label="Issue Number"
        value={data.issueNumber}
        onChange={(e) => update({ issueNumber: e.target.value })}
      />
    );
  },
  filter: (params, self) => {
    return params.issue.number == self.data.issueNumber
  }
};

const state = {
  id: "state",
  name: "State",
  data: {
    open: true,
    closed: true,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }
    var values = searchParams.getAll(self.id)
    Object.keys(self.data).forEach(key => {
      if (!values.includes(`${key}`)) {
        self.data[key] = false;
      }
    })
  },
  stringify: (self) => {
    if (self.data.open ^ self.data.closed) {
      return `${self.id}=${self.data.open ? "open" : "closed"}`;
    }
    return "";
  },
  render: ({ data, update }) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={data.open} />}
          label="open"
          onChange={(e) => {
            update({ ...data, open: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.closed} />}
          label="closed"
          onChange={(e) => {
            update({ ...data, closed: e.target.checked });
          }}
        />
      </FormGroup>
    );
  },
  filter: (params, self) => {
    if (self.data.open ^ self.data.closed) {
      return self.stringify(self).includes(params.issue.state)
    }
    return true;
  }
};

const issueTypes = ["bug", "enhancement", "feature", "feature-request"];

const type = {
  id: "type_label",
  name: "Type",
  data: {
    selected: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }

    self.data.selected = searchParams.get(self.id).replace("type/", "");
  },
  stringify: (self) => {
    if (self.data.selected !== undefined && self.data.selected != "-") {
      return `${self.id}=type/${self.data.selected}`;
    }
    return "";
  },
  render: ({ data, update }) => {
    return (
      <Select
        fullWidth
        onChange={(e) => {
          update({ ...data, selected: e.target.value });
        }}
        value={data.selected}
      >
        <MenuItem value={"-"}>-</MenuItem>
        {issueTypes.map((type) => {
          return <MenuItem value={type}>{type}</MenuItem>;
        })}
      </Select>
    );
  },
  filter: (params, self) => {
    if (self.data.selected !== undefined) {
      return self.stringify(self).includes(params.issue.type_label)
    }
    return true;
  }
};

const title = {
  id: "title",
  name: "Title",
  data: {
    title: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }

    self.data.title = searchParams.get(self.id);
  },
  stringify: (self) => {
    // TODO: add title search implement
    return "";
  },
  render: ({ data, update }) => {
    return (
      <TextField
        fullWidth
        label="Title"
        placeholder="no effect for now, under development"
        value={data.title}
        onChange={(e) => update({ title: e.target.value })}
      />
    );
  },
  filter: (params, self) => {
    return params.issue.title.includes(self.data.title)
  }
};

const repos = ["tidb", "tiflash", "tikv", "pd", "tiflow", "tidb-binlog", "tidb-tools"];

const repo = {
  id: "repo",
  name: "Repo",
  data: {
    selected: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }
    self.data.selected = searchParams.get(self.id);
  },
  stringify: (self) => {
    if (self.data.selected !== undefined && self.data.selected != "-") {
      return `${self.id}=${self.data.selected}`;
    }
    return "";
  },
  render: ({ data, update }) => {
    return (
      <Select
        fullWidth
        onChange={(e) => {
          update({ ...data, selected: e.target.value });
        }}
        value={data.selected}
      >
        <MenuItem value={"-"}>-</MenuItem>
        {repos.map((repo) => {
          return <MenuItem value={repo}>{repo}</MenuItem>;
        })}
      </Select>
    );
  },
  filter: (params, self) => {
    if (self.data.selected == undefined || self.data.selected == "-") {
      return true
    }
    return params.issue.repo == self.data.selected
  }
};

const componentMap = new Map();

componentMap.set("tidb", ["br", "lightning", "dumpling", "sql-infra", "execution", "transaction", "planner", "diagnosis", "tidb"]);
componentMap.set("tiflash", ["storage", "compute", "tiflash"]);
componentMap.set("tiflow", ["dm", "cdc", "tiflow"]);


const components = {
  id: "components",
  name: "Components",
  data: {
    components: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }

    self.data.components = searchParams.get(self.id);
  },
  stringify: (self) => {
    if (self.data.components !== undefined && self.data.components != "-") {
      return `${self.id}=${self.data.components}`;
    }
    return "";
  },
  render: ({ data, update, filterState }) => {
    let repo = filterState["Repo"].data.selected;

    let menu = []
    if (Array.from(componentMap.keys()).includes(repo)) {
      menu = componentMap.get(repo)
    } else if (!repo || repo == "-") {
      componentMap.forEach((v) => { menu.push(...v) })
      repos.forEach((repo) => {
        if (!menu.includes(repo)) {
          menu.push(repo)
        }
      })
    } else {
      menu.push(repo)
    }

    return (
      <Select
        fullWidth
        onChange={(e) => {
          update({ ...data, components: e.target.value });
        }}
        value={data.components}
      >
        <MenuItem value={"-"}>-</MenuItem>
        {menu.map((component) => {
          return <MenuItem value={component}>{component}</MenuItem>;
        })}
      </Select>
    );

  },
  filter: (params, self) => {
    if (self.data.components == undefined || self.data.components == "-") {
      return true
    }
    return params.issue.components.includes(self.data.components)
  }
};

const severityLabels = ["critical", "major", "moderate", "minor"];

const severity = {
  id: "severity_labels",
  name: "Severity",
  data: {
    critical: true,
    major: true,
    moderate: true,
    minor: true,
    // none: true,
  },
  set: (searchParams, self) => {

    if (!searchParams.has(self.id)) {
      return
    }
    var values = searchParams.getAll(self.id);
    Object.keys(self.data).forEach(key => {
      if (!values.includes(`severity/${key}`)) {
        self.data[key] = false;
      }
    })
  },
  stringify: (self) => {
    if (
      self.data.critical &&
      self.data.major &&
      self.data.moderate &&
      self.data.minor
      // self.data.none
    ) {
      // all data
      return "";
    }
    return severityLabels
      .filter((label) => self.data[label])
      .map((label) => `${self.id}=severity/${label}`)
      .join("&");
  },
  render: ({ data, update }) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={data.critical} />}
          label="critical"
          onChange={(e) => {
            update({ ...data, critical: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.major} />}
          label="major"
          onChange={(e) => {
            update({ ...data, major: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.moderate} />}
          label="moderate"
          onChange={(e) => {
            update({ ...data, moderate: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.minor} />}
          label="minor"
          onChange={(e) => {
            update({ ...data, minor: e.target.checked });
          }}
        />
      </FormGroup>
    );
  },
  filter: (params, self) => {
    return severityLabels
      .filter((label) => self.data[label])
      .map((label) => `severity_labels=severity/${label}`)
      .join("&").includes(params.issue.severity_label);
  }
};

const affect = {
  id: "affect_version",
  name: "Affect",
  data: {
    versions: undefined,
    version: undefined,
    result: undefined,
  },
  set: (searchParams, self) => {

    if (!searchParams.has(self.id)) {
      return
    }
    self.data.version = searchParams.get("affect_version")
    self.data.result = searchParams.get("affect_result")
  },
  stringify: (self) => {
    if (self.data.version !== undefined && self.data.result !== undefined &&
      self.data.version != "-" && self.data.result != "-") {
      return `affect_version=${self.data.version}&affect_result=${self.data.result}`;
    }
    return "";
  },
  render: ({ data, update }) => {
    const versions = data.versions || [
      "6.0",
      "5.4",
      "5.3",
      "5.2",
      "5.1",
      "5.0",
    ];
    const results = ["UnKnown", "Yes", "No"];

    return (
      <Stack direction={"row"}>
        <Select
          fullWidth
          placeholder="version"
          onChange={(e) => {
            update({ ...data, version: e.target.value });
          }}
          value={data.version}
        >
          <MenuItem value={"-"}>-</MenuItem>
          {versions.map((version) => {
            return <MenuItem value={version}>{version}</MenuItem>;
          })}
        </Select>
        <Select
          fullWidth
          placeholder="affect?"
          onChange={(e) => {
            update({ ...data, result: e.target.value });
          }}
          value={data.result}
        >
          <MenuItem value={"-"}>-</MenuItem>
          {results.map((result) => {
            return <MenuItem value={result}>{result}</MenuItem>;
          })}
        </Select>
      </Stack>
    );
  },
  filter: (params, self) => {
    // TODO 当All Issues页面需要前端筛选时补充该逻辑
    return true;
  }
};

const blockStatus = ["Block", "None Block", "N/A"]

const releaseBlock = {
  id: "block",
  name: "Release Block",
  data: {
    selected: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }
    self.data.selected = searchParams.get(self.id);
  },
  stringify: (self) => {
    if (self.data.selected !== undefined && self.data.selected != "-") {
      return `${self.id}=${self.data.selected}`;
    }
    return "";
  },
  render: ({ data, update }) => {
    return (
      <Select
        fullWidth
        onChange={(e) => {
          update({ ...data, selected: e.target.value });
        }}
        value={data.selected}
      >
        <MenuItem value={"-"}>-</MenuItem>
        {blockStatus.map((type) => {
          if (type == "N/A") {
            return <MenuItem value={type}>Not Triaged</MenuItem>;
          }
          return <MenuItem value={type}>{type}</MenuItem>;
        })}
      </Select>
    );
  },
  filter: (params, self) => {
    if (self.data.selected == "N/A") {
      return params.version_triage.block_version_release == undefined
    }

    if (self.data.selected !== undefined && self.data.selected != "-") {
      return self.data.selected == params.version_triage.block_version_release
    }

    return true;
  }
};

const createTime = {
  id: "created_at_stamp",
  name: "Create Time",
  data: {
    createTime: null,
    createTimeEnd: null,
  },
  set: (searchParams, self) => {
    if (searchParams.has(self.id)) {
      var timeStamp = searchParams.get(self.id) * 1000
      var date = new Date(timeStamp)
      self.data.createTime = date;
    }

    if (searchParams.has("created_at_stamp_end")) {
      self.data.createTimeEnd = new Date(searchParams.get("created_at_stamp_end") * 1000);
    }
  },
  stringify: (self) => {
    if (self.data.createTime == undefined && self.data.createTimeEnd == undefined) {
      return ""
    }
    if (typeof (self.data.createTime) == "string") {
      self.data.createTime = new Date(self.data.createTime)
    }
    if (typeof (self.data.createTimeEnd) == "string") {
      self.data.createTimeEnd = new Date(self.data.createTimeEnd)
    }

    var startFilter = self.data.createTime ? `${self.id}=${self.data.createTime.getTime() / 1000}` : "";
    var endFilter = self.data.createTimeEnd ? `created_at_stamp_end=${self.data.createTimeEnd.getTime() / 1000}` : "";
    return [startFilter, endFilter].filter(v => v.length > 0).join("&")
  },
  render: ({ data, update }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="from"
          value={data.createTime}
          onChange={(e) => update({ ...data, createTime: e })}
        />
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="to"
          value={data.createTimeEnd}
          onChange={(e) => update({ ...data, createTimeEnd: e })}
        />
      </LocalizationProvider>
    );
  },
  filter: (params, self) => {
    if (self.data.createTime == null && self.data.createTimeEnd == null) {
      return true;
    }
    var result = true
    if (self.data.createTime != null) {
      result = result && (new Date(params.issue.create_time) >= self.data.createTime.getTime())
    }

    if (result && self.data.createTimeEnd != null) {
      result = result && (new Date(params.issue.create_time) <= self.data.createTimeEnd.getTime())
    }

    return result
  }
};

const closeTime = {
  id: "closed_at_stamp",
  name: "Close Time",
  data: {
    closeTime: null,
    closeTimeEnd: null,
  },
  set: (searchParams, self) => {
    if (searchParams.has(self.id)) {
      self.data.closeTime = new Date(searchParams.get(self.id) * 1000);
    }
    if (searchParams.has("closed_at_stamp_end")) {
      self.data.closeTimeEnd = new Date(searchParams.get("closed_at_stamp_end") * 1000);
    }
  },
  stringify: (self) => {
    if (self.data.closeTime == undefined && self.data.closeTimeEnd == undefined) {
      return ""
    }
    if (typeof (self.data.closeTime) == "string") {
      self.data.closeTime = new Date(self.data.closeTime)
    }
    if (typeof (self.data.closeTimeEnd) == "string") {
      self.data.closeTimeEnd = new Date(self.data.closeTimeEnd)
    }
    var startFilter = self.data.closeTime ? `${self.id}=${self.data.closeTime.getTime() / 1000}` : "";
    var endFilter = self.data.closeTimeEnd ? `closed_at_stamp_end=${self.data.closeTimeEnd.getTime() / 1000}` : "";
    return [startFilter, endFilter].filter(v => v.length > 0).join("&")
  },
  render: ({ data, update }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="from"
          value={data.closeTime}
          onChange={(e) => update({ ...data, closeTime: e })}
        />
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="to"
          value={data.closeTimeEnd}
          onChange={(e) => update({ ...data, closeTimeEnd: e })}
        />
      </LocalizationProvider>
    );
  },
  filter: (params, self) => {
    if (self.data.closeTime == null && self.data.closeTimeEnd == null) {
      return true;
    }
    var result = true
    if (self.data.closeTime != null) {
      result = result && (new Date(params.issue.close_time).getTime() >= self.data.closeTime.getTime())
    }

    if (result && self.data.closeTimeEnd != null) {
      result = result && (new Date(params.issue.close_time).getTime() <= self.data.closeTimeEnd.getTime())
    }

    return result
  }
};


// Only for all issue page
const isNeedTriage = {
  id: "is_need_triage",
  name: "Need Triage",
  data: {
    is_need_triage: false,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }
    var value = searchParams.getAll(self.id)
    if (value == "true") {
      self.data.is_need_triage = true
    } else {
      self.data.is_need_triage = false
    }
  },
  stringify: (self) => {
    if (self.data.is_need_triage) {
      return `${self.id}=true`;
    }
    return "";
  },
  render: ({ data, update }) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={data.is_need_triage} />}
          label=""
          onChange={(e) => {
            update({ ...data, is_need_triage: e.target.checked });
          }}
        />
      </FormGroup>
    );
  },
};



const triageResultLabel = ["approved", "later", "won't fix", "unknown", "approved(frozen)", "N/A"];

const triageResult = {
  id: "triage_result",
  name: "Triage Result",
  data: {
    selected: undefined,
  },
  set: (searchParams, self) => {
    if (!searchParams.has(self.id)) {
      return
    }
    self.data.selected = searchParams.get(self.id);
  },
  stringify: (self) => {
    if (self.data.selected !== undefined && self.data.selected !== "-") {
      return `${self.id}=${self.data.selected}`;
    }
    return "";
  },
  render: ({ data, update }) => {
    return (
      <Select
        fullWidth
        onChange={(e) => {
          update({ ...data, selected: e.target.value });
        }}
        value={data.selected}
      >
        <MenuItem value={"-"}>-</MenuItem>
        {triageResultLabel.map((label) => {
          if (label == "N/A") {
            return <MenuItem value={label}>Not Triaged</MenuItem>;
          }
          return <MenuItem value={label}>{label}</MenuItem>;
        })}
      </Select>
    );
  },
  filter: (params, self) => {
    if (self.data.selected == undefined || self.data.selected == "-") {
      return true
    }

    const version = params.version_triage.version_name
    const minorVersion = version.split(".").slice(0, 2).join(".")
    const version_triage = params.version_triages?.filter((t) =>
      t.version_name.startsWith(minorVersion)
    )[0];
    return getVersionTriageValue(version_triage) == self.data.selected
  }
};

const versionTriageStatusLabel = ["need pr", "need approve", "need review", "ci testing", "finished"];

const versionTriageStatus = {
  id: "version_triage_status",
  name: "Triage Status",
  data: {
    need_pr: true,
    need_approve: true,
    need_review: true,
    ci_testing: true,
    finished: true,
    // none: true,
  },
  set: (searchParams, self) => {
    var values = searchParams.getAll("version_triage_status")
    Object.keys(self.data).forEach(key => {
      if (!values.includes(`${key}`)) {
        self.data[key] = false;
      }
    })
  },
  stringify: (self) => {
    if (
      self.data.need_pr &&
      self.data.need_approve &&
      self.data.need_review &&
      self.data.ci_testing &&
      self.data.finished
      // self.data.none
    ) {
      // all data
      return "";
    }
    // 目前仅用于VersionTriage页面的前端筛选使用，未与后端联调验证
    return versionTriageStatusLabel
      .map((label) => label.replace(" ", "_"))
      .filter((label) => self.data[label])
      .map((label) => `${self.id}=${label}`)
      .join("&");
  },
  render: ({ data, update }) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={data.need_pr} />}
          label="need pr"
          onChange={(e) => {
            update({ ...data, need_pr: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.need_approve} />}
          label="need approve"
          onChange={(e) => {
            update({ ...data, need_approve: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.need_review} />}
          label="need review"
          onChange={(e) => {
            update({ ...data, need_review: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.ci_testing} />}
          label="ci testing"
          onChange={(e) => {
            update({ ...data, ci_testing: e.target.checked });
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={data.finished} />}
          label="finished"
          onChange={(e) => {
            update({ ...data, finished: e.target.checked });
          }}
        />
      </FormGroup>
    );
  },
  filter: (params, self) => {
    return versionTriageStatusLabel
      .map((label) => label.replace(" ", "_"))
      .filter((label) => self.data[label])
      .map((label) => `version_triage_status=${label}`)
      .join("&").includes(params.version_triage_merge_status.replace(" ", "_"));
  }
};

function array2queryString(array = []) {
  if (array.length == 0) {
    return "";
  }
  return "?" + array
    .map((item) => {
      return stringify(item);
    })
    .filter((item) => item.length > 0)
    .join("&");
};

export const Filters = { number, repo, title, affect, type, state, severity, createTime, closeTime, versionTriageStatus, triageResult, components, releaseBlock, isNeedTriage };

export function FilterDialog({ open, onClose, onUpdate, filters }) {
  var wrapedOnUpdate = (filterState) => {
    onUpdate(filterState);
    var currentUrl = window.location.href
    var queryString = array2queryString(Object.values(filterState));
    var targetUrl = currentUrl.includes("?") ?
      currentUrl.replace(/\?.*/, queryString) : currentUrl + queryString;
    let history = createBrowserHistory()
    history.push(targetUrl, filterState);
  }

  const [filterState, setFilterState] = React.useState(
    filters.reduce((map, flt) => {
      map[flt.name] = { ...flt, data: JSON.parse(JSON.stringify(flt.data)) };
      return map;
    }, {})
  );
  return (
    <Dialog onClose={onClose} open={open} maxWidth="md" fullWidth>
      <TiDialogTitle onClose={onClose}>Filter Selection</TiDialogTitle>
      <Stack padding={2}>
        <Table>
          <TableBody>
            {filters.map((f) => {
              return (
                <TableRow>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>
                    {f.render({
                      data: filterState[f.name].data,
                      update: (data) =>
                        setFilterState({
                          ...filterState,
                          [f.name]: { ...f, data },
                        }),
                      filterState: filterState,
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Stack>
      <DialogActions>
        <Button
          autoFocus
          variant="contained"
          onClick={() => {
            wrapedOnUpdate(filterState);
          }}
        >
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
}
