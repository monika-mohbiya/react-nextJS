import { render, screen } from "@testing-library/react";
import TaskTable from "@/components/TaskTable";
import { Task, TaskStatus } from "@/types/task";

// Mock Redux hooks
jest.mock("@/hooks/reduxHooks", () => ({
    useAppDispatch: () => jest.fn(),
    useAppSelector: (selector: any) => {
        const state = {
            tasks: {
                currentPage: 1,
                total: 1,
                pageSize: 20,
            },
        };

        return selector(state);
    },
}));

// Mock selector
jest.mock("@/redux_tasks/selectors", () => ({
    selectSelectedTask: () => null,
}));

describe("TaskTable", () => {
    const tasks: Task[] = [
        {
            id: "1",
            title: "Image Task",
            status: TaskStatus.TODO,
            type: "image",
            assignee: {
                id: "u1",
                name: "Monika",
            },
            annotationCount: 4,
            updatedAt: Date.now(),
            meta: {},
        },
    ];

    it("renders task row", () => {
        render(<TaskTable tasks={tasks} />);

        expect(screen.getByText("Image Task")).toBeInTheDocument();
        expect(screen.getByText("Monika")).toBeInTheDocument();
        expect(screen.getByText("image")).toBeInTheDocument();
    });
});