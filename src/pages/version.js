import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import Layout from '../layout/Layout';
import Version from '../components/version/Version';

const VersionPage = () => {
    return (
        <Layout>
            <Container maxWidth="xxl" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Version />
                </Paper>
            </Container>
        </Layout>
    )
};

export default VersionPage;
