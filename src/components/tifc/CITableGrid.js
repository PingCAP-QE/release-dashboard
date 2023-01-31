import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import CIColumnsGrid from "./CIColumnsGrid";

export const RenderCITableGrid = ({data}) => {
    return (
        <>
        <div style={{ height: 650, width: '100%' }}>
        <DataGrid
            rows = {data}
            columns = {CIColumnsGrid}
            pageSize = {100}
            rowsPerPageOptions = {[100]}
            components={{
                Toolbar: GridToolbar,
            }}
            rowHeight = {70}
            showCellRightBorder = {true}
            showColumnRightBorder = {false}
            // checkboxSelection
            disableSelectionOnClick
        />
        </div>
        </>
    );
}
