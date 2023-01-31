import * as React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Layout from "../layout/Layout";
import ReleaseTable from "../components/release/ReleaseTable";
import { Filters } from "../components/issues/filter/FilterDialog";
import Columns from "../components/issues/GridColumns"
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { fetchActiveVersions } from "../components/issues/fetcher/fetchVersion"
import { useQuery } from "react-query";

const Release = () => {
  const params = useParams();
  // Duplicate with AllIssues plane.
  // Because the "useSearchParams" must be used in component function.
  const [searchParams, setSearchParams] = useSearchParams();

  const versionName = params.version === undefined ? "none" : params.version;
  const minorVersion = versionName == "none" ? "none" : versionName.split(".").slice(0, 2).join(".");

  const versionQuery = useQuery(["version", versionName], () => fetchActiveVersions({ versionName: minorVersion }));
  if (versionQuery.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (versionQuery.error) {
    return (
      <div>
        <p>Error: {versionQuery.error}</p>
      </div>
    );
  }

  const version = versionQuery.data.length == 0 ? {} : versionQuery.data[0];

  Object.values(Filters).map(filter => {
    if (filter.id != undefined) {
      filter.set(searchParams, filter);
    }
  })

  return (
    <Layout>
      <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <ReleaseTable customFilter={true} filters=
            // copy data
            {[
              {
                ...Filters.repo,
                data: JSON.parse(JSON.stringify(Filters.repo.data)),
              },
              {
                ...Filters.components,
                data: JSON.parse(JSON.stringify(Filters.components.data)),
              },
              {
                ...Filters.number,
                data: JSON.parse(JSON.stringify(Filters.number.data)),
              },
              // {
              //   ...Filters.title,
              //   data: JSON.parse(JSON.stringify(Filters.title.data)),
              // },
              {
                ...Filters.state,
                data: JSON.parse(JSON.stringify(Filters.state.data)),
              },
              {
                ...Filters.versionTriageStatus,
                data: JSON.parse(JSON.stringify(Filters.versionTriageStatus.data))
              },
              {
                ...Filters.triageResult,
                data: JSON.parse(JSON.stringify(Filters.triageResult.data))
              },
              {
                ...Filters.type,
                data: JSON.parse(JSON.stringify(Filters.type.data)),
              },
              {
                ...Filters.severity,
                data: JSON.parse(JSON.stringify(Filters.severity.data)),
              }, {
                ...Filters.releaseBlock,
                data: JSON.parse(JSON.stringify(Filters.releaseBlock.data)),
              }, {
                ...Filters.createTime,
                data: {
                  ...JSON.parse(JSON.stringify(Filters.createTime.data)),
                },
              },
              {
                ...Filters.closeTime,
                data: {
                  ...JSON.parse(JSON.stringify(Filters.closeTime.data)),
                },
              },

            ]}
            columns={[
              ...Columns.issueBasicInfo,
              Columns.createdTime,
              Columns.closedTime,
              Columns.triageStatus,
              Columns.releaseBlock,
              // Version triage is towards the minor version.
              Columns.getAffectionOnVersion(minorVersion),
              Columns.getPROnVersion(minorVersion),
              Columns.getPickOnVersion(version, minorVersion),
              Columns.getFixedInLowerVersion(minorVersion),
              Columns.getAffectedLowerVersion(minorVersion),
              Columns.changed,
              Columns.comment,
            ]}
          />
        </Paper>
      </Container>
    </Layout>
  );
};

export default Release;
