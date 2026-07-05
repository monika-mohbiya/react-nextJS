import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { tasksSelectors } from "./tasksSlice";

// EntityAdapter selectors
export const selectAllTasks = tasksSelectors.selectAll;
export const selectTaskById = tasksSelectors.selectById;

export const selectVisibleTasks = createSelector(
    [
        selectAllTasks,
        (state: RootState) => state.tasks.search,
        (state: RootState) => state.tasks.statusFilter,
        (state: RootState) => state.tasks.typeFilter,
        (state: RootState) => state.tasks.sortBy,
        (state: RootState) => state.tasks.sortOrder,
    ],
    (tasks = [], search = "", status, type, sortBy, sortOrder) => {

        const safeSearch = search.toLowerCase();

        const filtered = tasks.filter((task) => {
            const title = (task?.title ?? "").toLowerCase();

            const matchesSearch = title.includes(safeSearch);

            const matchesStatus =
                status === "all" || task?.status === status;

            const matchesType =
                type === "all" || task?.type === type;

            return matchesSearch && matchesStatus && matchesType;
        });

        return [...filtered].sort((a, b) => {
            const aTime =
                typeof a.updatedAt === "string"
                    ? new Date(a.updatedAt).getTime()
                    : a.updatedAt;

            const bTime =
                typeof b.updatedAt === "string"
                    ? new Date(b.updatedAt).getTime()
                    : b.updatedAt;

            if (sortBy === "updatedAt") {
                return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
            }

            if (sortBy === "title") {
                return sortOrder === "asc"
                    ? (a.title ?? "").localeCompare(b.title ?? "")
                    : (b.title ?? "").localeCompare(a.title ?? "");
            }

            return 0;
        });
    }
);
export const selectCurrentPage = (state: RootState) =>
    state.tasks.currentPage;

export const selectPageSize = (state: RootState) =>
    state.tasks.pageSize;

export const selectTotal = (state: RootState) =>
    state.tasks.total;

export const selectSelectedTask = createSelector(
    [
        selectAllTasks,
        (state: RootState) => state.tasks.selectedTaskId,
    ],
    (tasks, id) =>
        tasks.find((task) => task.id === id) ?? null
);

