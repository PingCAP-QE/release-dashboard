import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../components/databoard/Chart';
import Deposits from '../components/databoard/Deposits';
import Orders from '../components/databoard/Orders';
import Layout from '../layout/Layout'

const DataBoard = () => {
  return (
    <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                }}
            >
                <Chart />
            </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                }}
            >
                <Deposits />
            </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Orders />
            </Paper>
            </Grid>
        </Grid>
        </Container>
    </Layout>
  );
};

export default DataBoard;
