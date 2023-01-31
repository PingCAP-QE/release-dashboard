import * as React from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Layout from "../layout/Layout";
import AssignmentsTable from "../components/assignments/AssignmentsTable";

const Assignments = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <AssignmentsTable />
        </Paper>
      </Container>
    </Layout>
  );
};

export default Assignments;
