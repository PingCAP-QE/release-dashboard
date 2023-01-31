import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';

export const CITips = () => {
    const tips1 = 
        <div>
            <div>All CI failure are categorized into 2 types: product bug and test bug. And we distinguish these failures by a "baseline run" setup by EE team, which triggers the CI tasks hourly on master branch.</div>
            <div>· Product bug: fails in VerifyCI but not fail in "baseline run"</div> 
            <div>· Test bug: fails in VerifyCI and fail in "baseline run".</div>
            <div>Right now, we only cover result of 1 tasks(unit test) from VerifyCI, and more tasks will be added later.</div>
        </div>;
    const tips2 = "Open unstable insight page";
    const url = "https://tiinsights.pingcap.net/watch/public/dashboard/2b613238-4910-4d8a-9872-def03dbff468"

    const CustomWidthTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            minWidth: 750,
        },
    });

    return (
        <>
        <CustomWidthTooltip title={tips1} sx={{ m: 0, display: 'inline-flex'}}>
            <IconButton color="primary">
                <HelpIcon />
            </IconButton>
        </CustomWidthTooltip>
        <Tooltip title={tips2} sx={{ m: 0, display: 'inline-flex'}}>
            <Link href={url} target="_blank">
            <IconButton color="primary">
                <DataThresholdingIcon />
            </IconButton>
            </Link>
        </Tooltip>
        </>
    );
}
