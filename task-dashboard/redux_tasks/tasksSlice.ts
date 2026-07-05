import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
} from "@reduxjs/toolkit";

import { Task, TaskStatus, TaskType } from "@/types/task";

import { fetchTasks } from "./taskThunk";
import type { RootState } from "@/store/store";

const tasksAdapter = createEntityAdapter<Task>();

const initialState = tasksAdapter.getInitialState({
    loading: false,
    error: null as string | null,

    search: "",
    statusFilter: "all" as TaskStatus | "all",
    typeFilter: "all" as TaskType | "all",

    sortBy: "updatedAt" as "updatedAt" | "title",
    sortOrder: "desc" as "asc" | "desc",

    currentPage: 1,
    pageSize: 20,
    total: 0,

    selectedTaskId: null as string | null,

    isCached: false,
    isRefreshing: false,
});

const tasksSlice = createSlice({
    name: "tasks",
    initialState,

    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            tasksAdapter.setAll(state, action.payload)
        },

        addTask: (state, action: PayloadAction<Task>) => {
            tasksAdapter.addOne(state, action.payload);
        },

        updateTask: (
            state,
            action: PayloadAction<{
                id: string;
                status?: TaskStatus;
                updatedAt?: number;
                assignee?: {
                    id: string;
                    name: string;
                } | null;
            }>
        ) => {
            const task = state.entities[action.payload.id];
            if (!task) return;

            if (action.payload.status !== undefined) {
                task.status = action.payload.status; // NO normalization
            }

            if (action.payload.updatedAt !== undefined) {
                task.updatedAt = action.payload.updatedAt;
            }

            if (action.payload.assignee !== undefined) {
                task.assignee = action.payload.assignee;
            }
        },

        removeTask: (state, action: PayloadAction<string>) => {
            tasksAdapter.removeOne(state, action.payload);
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },

        setStatusFilter: (
            state,
            action: PayloadAction<TaskStatus | "all">
        ) => {
            state.statusFilter = action.payload;
        },

        setTypeFilter: (
            state,
            action: PayloadAction<TaskType | "all">
        ) => {
            state.typeFilter = action.payload;
        },
        setSortBy: (
            state,
            action: PayloadAction<"updatedAt" | "title">
        ) => {
            state.sortBy = action.payload;
        },

        setSortOrder: (
            state,
            action: PayloadAction<"asc" | "desc">
        ) => {
            state.sortOrder = action.payload;
        },
        setSelectedTask: (
            state,
            action: PayloadAction<string | null>
        ) => {
            state.selectedTaskId = action.payload;
        },
        setCachedTasks: (state, action: PayloadAction<Task[]>) => {
            tasksAdapter.setAll(state, action.payload);

            state.isCached = true;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;

                tasksAdapter.setAll(state, action.payload.items);

                state.currentPage = action.payload.page;
                state.pageSize = action.payload.pageSize;
                state.total = action.payload.total;

                state.isCached = false;
                state.isRefreshing = false;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch tasks";
            });
    },
});

export const {
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setLoading,
    setError,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    setSortBy,
    setSortOrder,
    setSelectedTask,
    setCachedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export const tasksSelectors = tasksAdapter.getSelectors<RootState>(
    (state) => state.tasks
);
export const selectAllTasks = tasksSelectors.selectAll;

export const selectTaskById = (state: RootState, id: string) =>
    tasksSelectors.selectById(state, id);