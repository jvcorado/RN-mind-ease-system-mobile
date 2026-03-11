export type TaskUpdate = {
    title?: string;
    description?: string;
    status?: "todo" | "in_progress" | "done";
};
