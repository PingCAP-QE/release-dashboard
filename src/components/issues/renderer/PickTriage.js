import PickSelect from "./PickSelect";
import * as React from "react";
import { getAffection } from "./Affection";
import { mapPickStatusToBackend, mapPickStatusToFrontend } from "./mapper"

export function getVersionTriageValue(versionTriage) {
  if (versionTriage === undefined || versionTriage.triage_result.length == 0) {
    return "N/A"
  }
  return mapPickStatusToFrontend(versionTriage.triage_result);
}

export function getPickTriageValue(version) {
  return (params) => {
    const affection = getAffection(version)(params);
    if (affection === "N/A" || affection === "no") {
      return <>not affect</>;
    }
    // When there is exact version_triage info, pick it
    // otherwise pick the version triage info in the version_triages
    const version_triage = params.row.version_triage ? params.row.version_triage : params.row.version_triages?.filter((t) =>
      t.version_name.startsWith(version)
    ).sort(
      function compareFn(a, b) {
        return a.version_name < b.version_name ? 1 : -1;
      }
    )[0];
    return getVersionTriageValue(version_triage)
  };
}

// version: version response from backend 
export function renderPickTriage(version, minorVersionName) {
  const PickSelectWraper = ({ params }) => {
    const affection = getAffection(minorVersionName)(params);
    if (affection === "N/A" || affection === "no") {
      return <>not affect</>;
    }

    let version_triage = params.row.version_triages?.filter((t) =>
      t.version_name.startsWith(minorVersionName)
    ).sort(
      function compareFn(a, b) {
        return a.version_name < b.version_name ? 1 : -1;
      }
    )[0];

    const pick = version_triage === undefined || version_triage.triage_result.length == 0 ? "N/A" : mapPickStatusToFrontend(version_triage.triage_result);
    const patch = version_triage === undefined ? "N/A" : version_triage.version_name;

    const onChange = (value) => {
      value = mapPickStatusToBackend(value);

      if (value == "Accept" && (version !== undefined && version.status == "frozen")) {
        value = "Accept(Frozen)"
      }

      if (version_triage == undefined) {
        params.row.version_triages.push({
          version_name: minorVersionName,
          triage_result: value,
        })
      } else {
        if ((params.row.version_triages)) {
          params.row.version_triages.filter((t) =>
            t.version_name.startsWith(minorVersionName)
          ).sort(
            function compareFn(a, b) {
              return a.version_name < b.version_name ? 1 : -1;
            }
          )[0].triage_result = value
        }
      }
    }

    return (
      <>
        <PickSelect
          id={params.row.issue.issue_id}
          minorVersion={minorVersionName}
          patch={patch}
          pick={pick}
          onChange={onChange}
          isFrozen={version !== undefined && version.status == "frozen"}
        ></PickSelect>
      </>
    );
  };

  return (params) => <PickSelectWraper params={params} />
}

