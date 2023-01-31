import * as React from "react";
import Container from "@mui/material/Container";
import Layout from "../layout/Layout";

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from "@mui/material/Box";

import { useSearchParams } from "react-router-dom";
import { IssueDetail } from "../components/issues/IssueDetail"

function mapParentBreadcrumbs(redirectFromUrl) {
  if (redirectFromUrl == undefined) {
    return ""
  }
  if (redirectFromUrl.startsWith('/home/all')) {
    return "all"
  } else {
    return ""
  }
}

const SingleIssue = ({ }) => {
  // Duplicate with VersionTriage plane.
  // Because the "useSearchParams" must be used in component function.
  const [searchParams, setSearchParams] = useSearchParams();
  const issueNum = searchParams.get("issue_num")
  const issueId = searchParams.get("issue_id")
  const redirectFromUrl = searchParams.get("redirect_from")
  const title = "issue: " + (issueNum ? issueNum : issueId
  )
  return (
    <Layout>
      <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href={redirectFromUrl}>
            {mapParentBreadcrumbs(redirectFromUrl)}
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
        <Box sx={{ width: "100%" }}>
          <IssueDetail issueId={issueId}></IssueDetail>
        </Box>

      </Container>
    </Layout>
  );
};

export default SingleIssue;
