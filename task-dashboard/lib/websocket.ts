import { AppDispatch } from "@/store/store";
import {
    addTask,
    updateTask,
    removeTask,
} from "@/redux_tasks/tasksSlice";
import { TaskStatus } from "@/types/task";
import { safeNormalizeTask } from "@/lib/normalize";

// ==============================
// TYPES
// ==============================
export type WebSocketMessage =
    | {
        kind: "task.updated";
        payload: {
            id: string;
            status: string;
            updatedAt: number;
        };
    }
    | {
        kind: "task.assigned";
        payload: {
            id: string;
            assignee: {
                id: string;
                name: string;
            } | null;
        };
    }
    | {
        kind: "annotation.created";
        payload: {
            taskId: string;
            by: string;
            at: number;
        };
    }
    | {
        kind: "task.created";
        payload: unknown;
    }
    | {
        kind: "task.deleted";
        payload: {
            id: string;
        };
    };

// ==============================
// SOCKET STATE
// ==============================
let socket: WebSocket | null = null;
let retryCount = 0;
const MAX_RETRY = 5;

// ==============================
// CONNECT
// ==============================
export function connectWebSocket(
    dispatch: AppDispatch,
    onMessage?: (event: WebSocketMessage) => void
) {
    if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING)
    ) {
        return;
    }

    socket = new WebSocket("ws://localhost:4000/ws");

    socket.onopen = () => {
        retryCount = 0;
    };

    socket.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);

        // optional external listener
        onMessage?.(message);

        switch (message.kind) {
            // =====================================
            // UPDATE TASK (NO FULL NORMALIZATION)
            // =====================================
            case "task.updated":
                dispatch(
                    updateTask({
                        id: message.payload.id,
                        status: message.payload.status as TaskStatus,
                        updatedAt: message.payload.updatedAt,
                    })
                );
                break;

            // =====================================
            // ASSIGN TASK (NO FULL NORMALIZATION)
            // =====================================
            case "task.assigned":
                dispatch(
                    updateTask({
                        id: message.payload.id,
                        assignee: message.payload.assignee,
                    })
                );
                break;

            // =====================================
            // CREATE TASK (SAFE NORMALIZATION HERE)
            // =====================================
            case "task.created": {
                const task = safeNormalizeTask(message.payload);

                if (task) {
                    dispatch(addTask(task));
                } else {
                    console.warn("Invalid task.created payload:", message.payload);
                }

                break;
            }

            // =====================================
            // DELETE TASK
            // =====================================
            case "task.deleted":
                dispatch(removeTask(message.payload.id));
                break;

            // =====================================
            // ANNOTATION (NO REDUX CHANGE)
            // =====================================
            case "annotation.created":
                break;
        }
    };

    socket.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
    };

    socket.onclose = () => {
        socket = null;

        if (retryCount < MAX_RETRY) {
            retryCount++;



            setTimeout(() => {
                connectWebSocket(dispatch, onMessage);
            }, 3000);
        }
    };
}

// ==============================
// DISCONNECT
// ==============================
export function disconnectWebSocket() {
    socket?.close();
    socket = null;
    retryCount = 0;
}