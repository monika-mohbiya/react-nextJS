import {
    normalizeTask,
    normalizeStatus,
    safeNormalizeTask,
} from "@/lib/normalize";
import { TaskStatus } from "@/types/task";

describe("normalizeTask", () => {
    it("should normalize raw task", () => {
        const raw = {
            id: "1",
            title: "Image Task",
            type: "IMAGE",
            status: "InProgress",
            assignee: {
                id: "u1",
                name: "Monika",
            },
            annotationCount: "5",
            updatedAt: "2026-07-05T10:00:00Z",
            meta: {},
        };

        const task = normalizeTask(raw);

        expect(task.type).toBe("image");
        expect(task.status).toBe(TaskStatus.IN_PROGRESS);
        expect(task.annotationCount).toBe(5);
        expect(typeof task.updatedAt).toBe("number");
    });

    it("should return UNKNOWN for invalid status", () => {
        expect(normalizeStatus("abc")).toBe(TaskStatus.UNKNOWN);
    });

    it("should convert invalid type to unknown", () => {
        const raw = {
            id: "2",
            title: "Task",
            type: "video",
            status: "todo",
            assignee: null,
            annotationCount: "0",
            updatedAt: 0,
            meta: {},
        };

        expect(normalizeTask(raw).type).toBe("unknown");
    });

    it("safeNormalizeTask returns null for invalid object", () => {
        expect(safeNormalizeTask(null)).toBeNull();
        expect(safeNormalizeTask({})).toBeNull();
    });
});