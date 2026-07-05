import localforage from "localforage";
import { Task } from "@/types/task";

const taskDB = localforage.createInstance({
    name: "task-dashboard",
    storeName: "tasks",
});

const CACHE_KEY = "tasks_v1";

type CachePayload = {
    data: Task[];
    timestamp: number;
};

export async function saveTasks(tasks: Task[]) {
    await taskDB.setItem<CachePayload>(CACHE_KEY, {
        data: tasks,
        timestamp: Date.now(),
    });
}

export async function getTasks(): Promise<CachePayload> {
    return (
        (await taskDB.getItem<CachePayload>(CACHE_KEY)) ?? {
            data: [],
            timestamp: 0,
        }
    );
}

export async function clearTasks() {
    await taskDB.clear();
}