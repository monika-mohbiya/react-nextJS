"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { connectWebSocket, disconnectWebSocket, WebSocketMessage } from "@/lib/websocket";
import { updateTask } from "@/redux_tasks/tasksSlice";

export function useTaskFeed() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        connectWebSocket(dispatch, (event: WebSocketMessage) => {
            switch (event.kind) {
                case "task.updated":
                    dispatch(
                        updateTask({
                            id: event.payload.id,
                            status: event.payload.status as any,
                            updatedAt: event.payload.updatedAt,
                        })
                    );
                    break;

                case "task.assigned":
                    dispatch(
                        updateTask({
                            id: event.payload.id,
                            assignee: event.payload.assignee,
                        })
                    );
                    break;

                case "annotation.created":
                    // optional
                    break;
            }
        });

        return () => {
            disconnectWebSocket();
        };
    }, [dispatch]);
}