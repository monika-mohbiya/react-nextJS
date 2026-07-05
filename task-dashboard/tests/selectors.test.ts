import { selectVisibleTasks } from "@/redux_tasks/selectors";
import { TaskStatus } from "@/types/task";

describe("selectVisibleTasks", () => {
    it("filters by search", () => {
        const state: any = {
            tasks: {
                ids: ["1", "2"],
                entities: {
                    "1": {
                        id: "1",
                        title: "Image Task",
                        type: "image",
                        status: TaskStatus.TODO,
                        updatedAt: 100,
                    },
                    "2": {
                        id: "2",
                        title: "Audio Task",
                        type: "audio",
                        status: TaskStatus.DONE,
                        updatedAt: 200,
                    },
                },
                search: "image",
                statusFilter: "all",
                typeFilter: "all",
                sortBy: "updatedAt",
                sortOrder: "desc",
            },
        };

        const result = selectVisibleTasks(state);

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Image Task");
    });
});