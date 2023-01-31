
import { labelFilter } from "../GridColumns"
import { renderLabel } from '../renderer/Label'
import { renderIssueState } from '../renderer/IssueState'
import { renderAssignee } from '../renderer/Assignee'
import {
  Accordion, AccordionDetails, AccordionSummary, Stack, Typography, Table, TableCell, TableRow
} from "@mui/material";
import Box from '@mui/material/Box';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { renderPullRequest, getPullRequest } from '../renderer/PullRequest'


export function IssueMeta({ issue, masterPrs }) {
  return (
    <Stack
      spacing={0}
      width="100%"
    >
      <Accordion defaultExpanded={true} width={"100%"}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom variant="h8" component="div">
            {"Detail"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <Table>
              <TableRow>
                <TableCell>
                  <div>
                    Repo:&nbsp;
                    {issue.owner}/{issue.repo}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    Components:&nbsp;
                    {issue.components.join(", ")}
                  </div>
                </TableCell>
                <TableCell>
                  <div />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <div>
                    State:&nbsp;
                    {renderIssueState({ row: { issue: issue } })}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    CreateTime:&nbsp;
                    {
                      dayjs(issue.create_time).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    }
                  </div>
                </TableCell>
                <TableCell>
                  {issue.close_time !== undefined && (<div>
                    CloseTime:&nbsp;{
                      dayjs(issue.close_time).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    }
                  </div>)}
                </TableCell>
              </TableRow>

              <TableRow>

                <TableCell>
                  <div>
                    Severity:&nbsp;
                    {renderLabel((label) => label.name.startsWith("severity/"),
                      (label) => label.replace("severity/", "")
                    )({ row: { issue: issue } })}
                  </div>

                </TableCell>

                <TableCell>
                  <div>
                    Type:&nbsp;
                    {renderLabel((label) => label.name.startsWith("type/"),
                      (label) => label.replace("type/", "")
                    )({ row: { issue: issue } })}
                  </div>

                </TableCell>

                <TableCell>
                  <div>
                    Assignees:&nbsp;
                    {renderAssignee({ row: { issue: issue } })}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>
                  <div>
                    Other Labels:&nbsp;
                    {renderLabel(labelFilter,
                      (label) => label)({ row: { issue: issue } })
                    }
                  </div>

                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3}>
                  <div>
                    Master PRs:&nbsp;
                    {renderPullRequest("master")({ row: { pull_requests: masterPrs } })
                    }
                  </div>

                </TableCell>
              </TableRow>
            </Table>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}

export default IssueMeta;
