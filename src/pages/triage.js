import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Layout from '../layout/Layout';
import TriageTable from '../components/triage/TriageTable';

const Triage = () => {
    return (
        <Layout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <TriageTable />
                </Paper>
            </Container>
        </Layout>
    )
};

export default Triage;