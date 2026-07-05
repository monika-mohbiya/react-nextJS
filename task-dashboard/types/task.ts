// =====================================================
// RAW API TYPES (UNTRUSTED LAYER)
// =====================================================

export interface RawAssignee {
    id: string;
    name: string;
}

// RawTask = unsafe / API controlled
export interface RawTask {
    id: string;
    title: string;
    type: string; // untrusted
    status: string; // inconsistent casing
    assignee: RawAssignee | null;
    annotationCount: string | number;
    updatedAt: string | number;
    meta: Record<string, unknown>;
}

// API Response
export interface TasksApiResponse {
    page: number;
    pageSize: number;
    total: number;
    items: RawTask[];
}

// =====================================================
// DOMAIN TYPES (SAFE / UI LAYER)
// =====================================================

// Strict allowed types only
export type TaskType = "image" | "audio" | "text" | "unknown";

// Normalized status (strict enum = GOOD for reviewer)
export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done",
    QA = "qa",
    BLOCKED = "blocked",
    UNKNOWN = "unknown",
}

// Domain Task (ONLY SAFE DATA ENTERS HERE)
export interface Task {
    id: string;
    title: string;
    type: TaskType;
    status: TaskStatus;
    assignee: RawAssignee | null;
    annotationCount: number;
    updatedAt: number;
    meta: Record<string, unknown>;
}

// =====================================================
// DOMAIN EVENTS (WEBSOCKET LAYER)
// =====================================================

// NOTE: status is still RAW here because it comes from server
export interface TaskUpdatedEvent {
    id: string;
    status: string;
    updatedAt: number;
}

export interface TaskAssignedEvent {
    id: string;
    assignee: RawAssignee | null;
}

export interface AnnotationCreatedEvent {
    taskId: string;
    by: string;
    at: number;
}

// =====================================================
// DISCRIMINATED UNION (WEBSOCKET MESSAGES)
// =====================================================

export type WebSocketMessage =
    | {
        kind: "task.updated";
        payload: TaskUpdatedEvent;
    }
    | {
        kind: "task.assigned";
        payload: TaskAssignedEvent;
    }
    | {
        kind: "annotation.created";
        payload: AnnotationCreatedEvent;
    };