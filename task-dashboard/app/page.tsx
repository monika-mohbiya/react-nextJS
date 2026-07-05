"use client";

import { useEffect } from "react";

import { CircularProgress, Alert } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import { fetchTasks } from "@/redux_tasks/taskThunk";
import { selectVisibleTasks } from "@/redux_tasks/selectors";
import { setCachedTasks } from "@/redux_tasks/tasksSlice";

import { getTasks } from "@/lib/indexedDb";

import TaskTable from "@/components/TaskTable";
import TaskFilters from "@/components/TaskFilters";
import TaskDetails from "@/components/TaskDetails";

import { useTaskFeed } from "@/hooks/useTaskFeed";

export default function Home() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectVisibleTasks);

  const loading = useAppSelector(
    (state) => state.tasks.loading
  );

  const error = useAppSelector(
    (state) => state.tasks.error
  );

  const isCached = useAppSelector(
    (state) => state.tasks.isCached
  );

  // WebSocket
  useTaskFeed();

  // Load cache first, then fetch latest data
  useEffect(() => {
    async function loadTasks() {
      const cache = await getTasks();

      if (cache?.data?.length > 0) {
        dispatch(setCachedTasks(cache.data));
      }

      dispatch(fetchTasks(1));
    }

    loadTasks();
  }, [dispatch]);

  if (loading && tasks.length === 0) {
    return (
      <main className="flex justify-center items-center h-screen">
        <CircularProgress />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <Alert severity="error">
          {error}
        </Alert>
      </main>
    );
  }

  if (!loading && tasks.length === 0) {
    return (
      <main className="p-6">
        <TaskFilters />

        <p className="mt-5">
          No tasks found.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        Task Dashboard
      </h1>

      {isCached && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing cached data. Refreshing from server...
        </Alert>
      )}

      <TaskFilters />

      <div className="grid grid-cols-3 gap-4 mt-4">

        <div className="col-span-2">
          <TaskTable tasks={tasks} />
        </div>

        <div className="col-span-1">
          <TaskDetails />
        </div>

      </div>
    </main>
  );
}