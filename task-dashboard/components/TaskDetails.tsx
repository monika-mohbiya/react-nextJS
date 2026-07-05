"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectSelectedTask } from "@/redux_tasks/selectors";
import TaskSummary from "@/components/TaskSummary";

export default function TaskDetails() {

    const task = useAppSelector(selectSelectedTask);

    if (!task) {
        return <Typography>Select a task</Typography>;
    }

    return (
        <>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        {task.title}
                    </Typography>

                    <Typography>Status: {task.status}</Typography>
                    <Typography>Type: {task.type}</Typography>

                    <Typography>
                        Assignee: {task.assignee?.name ?? "Unassigned"}
                    </Typography>

                    <Typography>
                        Annotation Count: {task.annotationCount}
                    </Typography>

                    <Typography>
                        Updated: {new Date(task.updatedAt).toLocaleString()}
                    </Typography>
                </CardContent>
            </Card>

            <TaskSummary taskId={task.id} />
        </>
    );
}