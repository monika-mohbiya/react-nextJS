import { RawTask, Task, TaskStatus, TaskType } from "@/types/task";

function normalizeType(type: string): TaskType {
    const t = type?.toLowerCase();

    if (t === "image" || t === "audio" || t === "text") {
        return t;
    }
    return "unknown";
}

export function normalizeStatus(status: string): TaskStatus {
    const s = status?.toLowerCase();

    switch (s) {
        case "todo":
            return TaskStatus.TODO;

        case "inprogress":
        case "in_progress":
            return TaskStatus.IN_PROGRESS;

        case "done":
            return TaskStatus.DONE;

        case "qa":
            return TaskStatus.QA;

        case "blocked":
            return TaskStatus.BLOCKED;

        default:
            return TaskStatus.UNKNOWN;
    }
}

export function normalizeTask(task: RawTask): Task {
    const updatedAt =
        typeof task.updatedAt === "number"
            ? task.updatedAt
            : Date.parse(task.updatedAt);

    return {
        id: String(task.id),

        title: String(task.title ?? ""),

        type: normalizeType(task.type),

        status: normalizeStatus(task.status),

        assignee: task.assignee
            ? {
                id: task.assignee.id,
                name: task.assignee.name,
            }
            : null,

        annotationCount: Number(task.annotationCount ?? 0) || 0,

        updatedAt: isNaN(updatedAt) ? 0 : updatedAt,

        meta: task.meta ?? {},
    };
}
export function safeNormalizeTask(data: unknown): Task | null {
    if (!data || typeof data !== "object") {
        return null;
    }

    const task = data as Partial<RawTask>;

    if (typeof task.id !== "string") return null;
    if (typeof task.title !== "string") return null;

    return normalizeTask(task as RawTask);
}