import { renderIssueState } from "./renderer/IssueState";
import { renderAssignee } from "./renderer/Assignee";
import { getAffection, renderAffection } from "./renderer/Affection";
import { getPullRequest, renderPullRequest } from "./renderer/PullRequest";
import { getLabelValue, renderLabel } from "./renderer/Label";
import { getPickTriageValue, renderPickTriage } from "./renderer/PickTriage";
import { Button, Dialog, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { renderComment } from "./renderer/Comment";
import { renderChanged } from "./renderer/ChangedItem";
import { renderDateTime } from './renderer/Time'
import { renderBlockRelease } from "./renderer/BlockRelease";

const id = {
  field: "id",
  headerName: "Id",
  hide: true,
  valueGetter: (params) => params.row.issue.issue_id,
};

const repo = {
  field: "repo",
  headerName: "Repo",
  valueGetter: (params) => params.row.issue.repo,
};


const components = {
  field: "components",
  headerName: "Components",
  valueGetter: (params) => params.row.issue.components.join(", "),
};


const number = {
  field: "number",
  headerName: "Number",
  type: "string",
  valueGetter: (params) => (params.row.issue.number + "(" + params.row.issue.html_url + ")"),
  renderCell: (params) => (
    <a
      href={params.row.issue.html_url}
      _target="blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        window.open(params.row.issue.html_url);
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {params.row.issue.number}
    </a>
  ),
};


const title = {
  field: "title",
  headerName: "Title",
  width: 480,
  valueGetter: (params) => params.row.issue.title,
};

const type = {
  field: "type",
  headerName: "Type",
  width: 120,
  valueGetter: getLabelValue(
    (label) => label.name.startsWith("type/"),
    (label) => label.replace("type/", "")
  ),
  renderCell: renderLabel(
    (label) => label.name.startsWith("type/"),
    (label) => label.replace("type/", "")
  ),
};

const severity = {
  field: "severity",
  headerName: "Severity",
  width: 120,
  valueGetter: getLabelValue(
    (label) => label.name.startsWith("severity/"),
    (label) => label.replace("severity/", "")
  ),
  renderCell: renderLabel(
    (label) => label.name.startsWith("severity/"),
    (label) => label.replace("severity/", "")
  ),
};

const state = {
  field: "state",
  headerName: "State",
  valueGetter: (params) => params.row.issue.state,
  renderCell: renderIssueState,
};

const createdTime = {
  field: "create_time",
  headerName: "Create Time",
  hide: true,
  valueGetter: (params) => params.row.issue.create_time,
  renderCell: (params) => {
    return renderDateTime(params.row.issue.create_time);
  },
};

const closedTime = {
  field: "close_time",
  headerName: "Close Time",
  hide: true,
  valueGetter: (params) => params.row.issue.close_time,
  renderCell: (params) => {
    return renderDateTime(params.row.issue.close_time);
  },
};

const assignee = {
  field: "assignee",
  headerName: "Assignee",
  valueGetter: (params) =>
    params.row.issue.assigned_employees.map((assignees) => assignees.git_login).join(","),
  renderCell: renderAssignee,
};

export const labelFilter = (label) =>
  !label.name.startsWith("type/") &&
  !label.name.startsWith("severity/") &&
  !label.name.startsWith("affects-") &&
  !label.name.startsWith("may-affect-");

const labels = {
  field: "labels",
  headerName: "Labels",
  valueGetter: getLabelValue(labelFilter, (label) => label),
  renderCell: renderLabel(labelFilter, (label) => label),
};

const pr = {
  field: "pr",
  headerName: "PR",
  // include "main" or default branch as the default pr
  valueGetter: getPullRequest("master"),
  renderCell: renderPullRequest("master"),
};

const triageStatus = {
  field: "triage_status",
  headerName: "Triage Status",
  valueGetter: (params) => params.row.version_triage_merge_status,
};

const releaseBlock = {
  field: "release_block",
  headerName: "Release Blocked",
  valueGetter: (params) => params.row.version_triage.block_version_release,
  renderCell: renderBlockRelease
};

const comment = {
  field: "comment",
  headerName: "Comment",
  width: 480,
  valueGetter: (params) => params.row.version_triage.comment,
  renderCell: renderComment,
};

const changed = {
  field: "changed",
  width: 240,
  headerName: "Changed Item",
  valueGetter: (params) => params.row.version_triage.changed_item,
  renderCell: renderChanged,
};

function getAffectionOnVersion(version) {
  return {
    field: "affect_" + version,
    headerName: "Affect " + version,
    valueGetter: getAffection(version),
    renderCell: renderAffection(version),
  };
}

function getPROnVersion(version) {
  const branch = "release-" + version;
  return {
    field: "cherrypick_" + version,
    headerName: "PR for " + version,
    valueGetter: getPullRequest(branch),
    renderCell: renderPullRequest(branch),
  };
}

// version: version response from backend.
function getPickOnVersion(version, minorVersionName = "none") {
  const minorVersion = version == undefined || version.name == undefined ? minorVersionName : version.name.split(".").slice(0, 2).join(".");
  return {
    field: "pick_" + minorVersion,
    headerName: "Pick to " + minorVersion,
    width: 240,
    valueGetter: getPickTriageValue(minorVersion),
    renderCell: renderPickTriage(version, minorVersion),
  };
}

function getFixedInLowerVersion(version) {
  return {
    field: "fixed_version",
    headerName: "Fixed Lower Version",
    width: 160,
    valueGetter:
      (params) => {
        let issue = params.row.issue
        let fixVersions = params.row.version_triages.filter(
          (f) => issue.state == "closed" && f.version_name < version && f.triage_result == "Released");
        return [...new Set(fixVersions.map((f) => f.version_name.split(".").slice(0, 2).join(".")))].sort(
          function compareFn(a, b) {
            return a < b ? 1 : -1;
          }
        ).join(", ")
      }
    ,
    renderCell:
      (params) => {

        let issue = params.row.issue
        let fixVersions = params.row.version_triages.filter(
          (f) => issue.state == "closed" && f.version_name < version && f.triage_result == "Released");
        return (
          <>
            {
              [...new Set(fixVersions.map(
                (f) =>
                  (f.version_name.split(".").slice(0, 2).join("."))
              ))].sort(
                function compareFn(a, b) {
                  return a < b ? 1 : -1;
                }
              ).join(", ")
            }
          </>
        )

      }
  }
}

function getAffectedVersions(activeVersions) {
  return {
    field: "all_affected_versions",
    headerName: "Affected Versions",
    width: 180,
    valueGetter:
      (params) => {
        let affectedVersions = params.row.issue_affects.filter(
          (f) => activeVersions.includes(f.affect_version) && f.affect_result == "Yes");
        return [...new Set(affectedVersions.map((f) => f.affect_version))].sort(
          function compareFn(a, b) {
            return a < b ? 1 : -1;
          }
        ).join(", ")
      }
    ,
    renderCell:
      (params) => {
        let affectedVersions = params.row.issue_affects.filter(
          (f) => activeVersions.includes(f.affect_version) && f.affect_result == "Yes");
        return (
          <>
            {
              [...new Set(affectedVersions.map(
                (f) =>
                  (f.affect_version)
              ))].sort(
                function compareFn(a, b) {
                  return a < b ? -1 : 1;
                }
              ).join(", ")
            }
          </>
        )
      }
  }
}

function getTriagedVersions(activeVersions) {
  return {
    field: "all_triaged_versions",
    headerName: "Triaged Versions",
    width: 180,
    valueGetter:
      (params) => {
        let triagedVersions = params.row.version_triages.filter(
          t => {
            return t.triage_result != "UnKnown"
          }
        ).map(t => {
          return t.version_name.split(".").slice(0, 2).join(".");
        }).filter(t => {
          return activeVersions.includes(t)
        })

        return [...new Set(triagedVersions)].sort(
          function compareFn(a, b) {
            return a < b ? 1 : -1;
          }
        ).join(", ")
      }
    ,
    renderCell:
      (params) => {
        let triagedVersions = params.row.version_triages.filter(
          t => {
            return t.triage_result != "UnKnown"
          }
        ).map(t => {
          return t.version_name.split(".").slice(0, 2).join(".");
        }).filter(t => {
          return activeVersions.includes(t)
        })

        return (
          <>
            {
              [...new Set(triagedVersions)].sort(
                function compareFn(a, b) {
                  return a < b ? -1 : 1;
                }
              ).join(", ")
            }
          </>
        )
      }
  }
}

function getAffectedLowerVersion(version) {
  return {
    field: "affected_version",
    headerName: "Affected Lower Version",
    hide: true,
    width: 180,
    valueGetter:
      (params) => {
        let affectedVersions = params.row.issue_affects.filter(
          (f) => f.affect_version < version && f.affect_result == "Yes");
        return [...new Set(affectedVersions.map((f) => f.affect_version))].sort(
          function compareFn(a, b) {
            return a < b ? 1 : -1;
          }
        ).join(", ")
      }
    ,
    renderCell:
      (params) => {
        let affectedVersions = params.row.issue_affects.filter(
          (f) => f.affect_version < version && f.affect_result == "Yes");
        return (
          <>
            {
              [...new Set(affectedVersions.map(
                (f) =>
                  (f.affect_version)
              ))].sort(
                function compareFn(a, b) {
                  return a < b ? -1 : 1;
                }
              ).join(", ")
            }
          </>
        )
      }
  }
}

const Columns = {
  id,
  repo,
  components,
  number,
  title,
  state,
  createdTime,
  closedTime,
  type,
  labels,
  assignee,
  severity,
  pr,
  triageStatus,
  comment,
  changed,
  releaseBlock,
  getAffectionOnVersion,
  getPROnVersion,
  getPickOnVersion,
  getFixedInLowerVersion,
  getAffectedLowerVersion,
  getAffectedVersions,
  getTriagedVersions,
  issueBasicInfo: [id, repo, components, number, title, severity, labels, assignee],
};

export default Columns;
