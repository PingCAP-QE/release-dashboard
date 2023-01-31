import * as React from "react";
import Container from "@mui/material/Container";
import Layout from "../layout/Layout";

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";

import { useQuery } from "react-query";
import { IssueGrid } from "../components/issues/IssueGrid";
import Columns from "../components/issues/GridColumns";
import { fetchActiveVersions } from "../components/issues/fetcher/fetchVersion";
import { Filters } from "../components/issues/filter/FilterDialog";
import { useSearchParams } from "react-router-dom";

function Table() {
  const versionQuery = useQuery(["open", "version", "maintained"], fetchActiveVersions);
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

  const columns = [
    Columns.repo,
    Columns.components,
    Columns.number,
    Columns.title,
    Columns.state,
    { ...Columns.createdTime, hide: true },
    { ...Columns.closedTime, hide: true },
    { ...Columns.pr, hide: true },
    Columns.type,
    Columns.severity,
    { ...Columns.labels, hide: true },
  ];

  var minorVersions = []
  for (const version of versionQuery.data) {
    const versionName = version.name
    const minorVersion = versionName == undefined ? "none" : versionName.split(".").slice(0, 2).join(".");
    minorVersions.push(minorVersion)

    columns.push(
      { ...Columns.getAffectionOnVersion(minorVersion), hide: true },
      { ...Columns.getPROnVersion(minorVersion), hide: true },
      { ...Columns.getPickOnVersion(version, minorVersion), hide: true }
    );
  }

  columns.push(
    Columns.getAffectedVersions(minorVersions),
    Columns.getTriagedVersions(minorVersions),
  )

  return (
    <IssueGrid
      columns={columns}
      filters={[
        // copy data
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
        {
          ...Filters.title,
          data: JSON.parse(JSON.stringify(Filters.title.data)),
        },
        {
          ...Filters.state,
          data: JSON.parse(JSON.stringify(Filters.state.data)),
        },
        {
          ...Filters.type,
          data: JSON.parse(JSON.stringify(Filters.type.data)),
        },
        {
          ...Filters.severity,
          data: JSON.parse(JSON.stringify(Filters.severity.data)),
        },
        {
          ...Filters.affect,
          data: {
            ...JSON.parse(JSON.stringify(Filters.affect.data)),
            versions: minorVersions,
          },
        },
        {
          ...Filters.isNeedTriage,
          data: {
            ...JSON.parse(JSON.stringify(Filters.isNeedTriage.data)),
          },
        },

        {
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
      customFilter={true}
    ></IssueGrid>
  );
}

const AllIssues = () => {
  // Duplicate with VersionTriage plane.
  // Because the "useSearchParams" must be used in component function.
  const [searchParams, setSearchParams] = useSearchParams();
  Object.values(Filters).map(filter => {
    if (filter.id != undefined) {
      filter.set(searchParams, filter);
    }
  })

  return (
    <Layout>
      <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            All Issues(No filter, show list of last one year)
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: "100%" }}>
              <Table></Table>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Layout>
  );
};

export default AllIssues;
