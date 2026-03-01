export type TaskStatus = "todo" | "progress" | "done";

export interface TaskStep {
    id: string;
    text: string;
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    steps: TaskStep[];
    status: TaskStatus;
}

export const initialTasks: Task[] = [
    {
        id: "1",
        title: "Revisar material de estudo",
        steps: [
            { id: "1a", text: "Ler capítulo 3", completed: true },
            { id: "1b", text: "Fazer anotações", completed: false },
            { id: "1c", text: "Revisar pontos principais", completed: false },
        ],
        status: "progress",
    },
    {
        id: "2",
        title: "Preparar apresentação",
        steps: [
            { id: "2a", text: "Definir estrutura", completed: false },
            { id: "2b", text: "Criar slides", completed: false },
        ],
        status: "todo",
    },
    {
        id: "3",
        title: "Responder emails importantes",
        steps: [
            { id: "3a", text: "Email do professor", completed: true },
            { id: "3b", text: "Email do grupo", completed: true },
        ],
        status: "done",
    },
    {
        id: "4",
        title: "Organizar anotações da semana",
        steps: [],
        status: "todo",
    },
];
