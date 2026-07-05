"use client";

import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Pagination,
    Stack,
    Chip,
    Box,
    Typography,
} from "@mui/material";

import { Task } from "@/types/task";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchTasks } from "@/redux_tasks/taskThunk";
import { setSelectedTask } from "@/redux_tasks/tasksSlice";

interface TaskTableProps {
    tasks: Task[];
    onSelect?: (task: Task) => void;
}

const statusColor = (status: string) => {
    switch (status) {
        case "done":
            return "success";
        case "in_progress":
            return "warning";
        case "todo":
            return "info";
        default:
            return "default";
    }
};

export default function TaskTable({ tasks, onSelect }: TaskTableProps) {
    const dispatch = useAppDispatch();

    const { currentPage, total, pageSize } = useAppSelector(
        (state) => state.tasks
    );

    const totalPages = Math.ceil(total / pageSize);

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                p: 1,
            }}
        >
            <TableContainer>
                <Table>
                    {/* HEADER */}
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "#f5f7fb",
                            }}
                        >
                            {["Title", "Status", "Type", "Assignee", "Annotations", "Updated"].map(
                                (head) => (
                                    <TableCell
                                        key={head}
                                        sx={{
                                            fontWeight: 600,
                                            color: "#333",
                                        }}
                                    >
                                        {head}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>

                    {/* BODY */}
                    <TableBody>
                        {tasks.map((task, index) => (
                            <TableRow
                                key={task.id}
                                onClick={() => {
                                    dispatch(setSelectedTask(task.id));
                                    onSelect?.(task);
                                }}
                                sx={{
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                                    "&:hover": {
                                        backgroundColor: "#eef4ff",
                                        transform: "scale(1.001)",
                                    },
                                }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>
                                    {task.title}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={task.status}
                                        size="small"
                                        color={statusColor(task.status) as any}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={task.type}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>

                                <TableCell>
                                    {task.assignee?.name ?? (
                                        <Typography variant="body2" color="text.secondary">
                                            Unassigned
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell>{task.annotationCount}</TableCell>

                                <TableCell sx={{ color: "text.secondary" }}>
                                    {new Date(task.updatedAt).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* PAGINATION */}
            <Stack
                direction="row"
                justifyContent="center"
                sx={{
                    py: 2,
                    borderTop: "1px solid #eee",
                }}
            >
                <Pagination
                    page={currentPage}
                    count={totalPages}
                    color="primary"
                    shape="rounded"
                    onChange={(_, page) => {
                        dispatch(fetchTasks(page));
                    }}
                />
            </Stack>
        </Paper>
    );
}