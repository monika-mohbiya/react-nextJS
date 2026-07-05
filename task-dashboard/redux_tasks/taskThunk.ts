import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RawTask, Task } from "@/types/task";
import { saveTasks, getTasks } from "@/lib/indexedDb";
import { normalizeTask } from "@/lib/normalize";

// =====================================================
// RESPONSE TYPE (ONLY DOMAIN LAYER)
// =====================================================
interface TaskResponse {
    page: number;
    pageSize: number;
    total: number;
    items: Task[];
}

// =====================================================
// THUNK
// =====================================================
export const fetchTasks = createAsyncThunk<TaskResponse, number>(
    "tasks/fetchTasks",
    async (page) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/tasks?page=${page}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            // RAW API response
            const data: {
                page: number;
                pageSize: number;
                total: number;
                items: RawTask[];
            } = await response.json();

            // =================================================
            // NORMALIZATION BOUNDARY (IMPORTANT POINT)
            // =================================================
            const normalizedTasks: Task[] = data.items.map(normalizeTask);

            // Save ONLY normalized data
            await saveTasks(normalizedTasks);

            return {
                page: data.page,
                pageSize: data.pageSize,
                total: data.total,
                items: normalizedTasks,
            };
        } catch (error) {


            const cached = await getTasks();

            return {
                page: 1,
                pageSize: cached.data.length,
                total: cached.data.length,
                items: cached.data,
            };
        }
    }
);