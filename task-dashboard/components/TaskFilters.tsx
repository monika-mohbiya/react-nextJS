"use client";

import {
    TextField,
    MenuItem,
    Stack,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import {
    setSearch,
    setStatusFilter,
    setTypeFilter,
    setSortBy,
    setSortOrder,
} from "@/redux_tasks/tasksSlice";
import { TaskStatus, TaskType } from "@/types/task";
export default function TaskFilters() {
    const dispatch = useAppDispatch();

    const { search, statusFilter, typeFilter, sortBy,
        sortOrder, } =
        useAppSelector((state) => state.tasks);

    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 3 }}
        >
            <TextField
                label="Search"
                value={search}
                onChange={(e) =>
                    dispatch(setSearch(e.target.value))
                }
            />

            <TextField
                select
                label="Status"
                value={statusFilter}
                size="small"
                onChange={(e) =>
                    dispatch(
                        setStatusFilter(
                            e.target.value as TaskStatus | "all"
                        )
                    )
                }
            >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="todo">Todo</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
                <MenuItem value="qa">QA</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
            </TextField>

            <TextField
                select
                label="Type"
                value={typeFilter}
                size="small"
                onChange={(e) =>
                    dispatch(
                        setTypeFilter(
                            e.target.value as TaskType | "all"
                        )
                    )
                }
            >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
            </TextField>
            <TextField
                select
                label="Sort By"
                value={sortBy}
                size="small"
                onChange={(e) =>
                    dispatch(
                        setSortBy(
                            e.target.value as "updatedAt" | "title"
                        )
                    )
                }
            >
                <MenuItem value="updatedAt">
                    Updated Time
                </MenuItem>

                <MenuItem value="title">
                    Title
                </MenuItem>
            </TextField>

            <TextField
                select
                label="Order"
                value={sortOrder}
                size="small"
                onChange={(e) =>
                    dispatch(
                        setSortOrder(
                            e.target.value as "asc" | "desc"
                        )
                    )
                }
            >
                <MenuItem value="asc">
                    Ascending
                </MenuItem>

                <MenuItem value="desc">
                    Descending
                </MenuItem>
            </TextField>

        </Stack>
    );
}