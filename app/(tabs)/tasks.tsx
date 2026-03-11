import { Box, HStack, Input, InputField, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { CheckSquare, Plus } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CognitiveAlert } from "@/components/dashboard/CognitiveAlert";
import { FontProvider, useFontScale } from "@/components/dashboard/FontContext";
import { PomodoroTimer } from "@/components/tasks/PomodoroTimer";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task, TaskStep } from "@/constants/tasks";
import { useAppearance, useScaledSpace } from "@/contexts/AppearanceContext";
import { subtaskRepository } from "@/data/repositories/subtaskRespository";
import { taskRepository } from "@/data/repositories/taskRepository";

export default function TasksScreen() {
    const [fontSize] = useState(100);

    return (
        <FontProvider fontSize={fontSize}>
            <TasksContent />
        </FontProvider>
    );
}

function mapApiStatusToUi(status: string | null): Task["status"] {
    if (status === "in_progress") return "progress";
    if (status === "todo" || status === "done") return status as Task["status"];
    return "todo";
}

function mapUiStatusToApi(status: Task["status"]): "todo" | "in_progress" | "done" {
    if (status === "progress") return "in_progress";
    return status;
}

function TasksContent() {
    const { scale } = useFontScale();
    const space = useScaledSpace();
    const { complexityLevel, summaryMode, focusMode, disableAnimations, reduceVisualStimuli, contrastColors } = useAppearance();
    const hideDescriptions = complexityLevel === "simple" || summaryMode || focusMode;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBreakAlert, setShowBreakAlert] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const rows = await taskRepository.getTasks();
            const list = rows ?? [];
            const tasksWithSteps: Task[] = await Promise.all(
                list.map(async (row: { id: string; title: string; description?: string; status?: string | null }) => {
                    let steps: TaskStep[] = [];
                    try {
                        const subtasks = await subtaskRepository.getSubtasks(row.id);
                        steps = (subtasks ?? []).map((s: { id: string; title?: string; completed?: boolean }) => ({
                            id: s.id,
                            text: s.title ?? "",
                            completed: !!s.completed,
                        }));
                    } catch {
                        steps = [];
                    }
                    return {
                        id: row.id,
                        title: row.title,
                        steps,
                        status: mapApiStatusToUi(row.status ?? "todo"),
                    };
                })
            );
            setTasks(tasksWithSteps);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar tarefas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [fetchTasks])
    );

    // Separate tasks by status
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const progressTasks = tasks.filter((t) => t.status === "progress");
    const doneTasks = tasks.filter((t) => t.status === "done");

    const handleStepToggle = async (taskId: string, stepId: string) => {
        const task = tasks.find((t) => t.id === taskId);
        const step = task?.steps.find((s) => s.id === stepId);
        if (!step) return;
        const newCompleted = !step.completed;
        try {
            await subtaskRepository.updateSubtask(stepId, { completed: newCompleted });
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId
                        ? {
                            ...t,
                            steps: t.steps.map((s) =>
                                s.id === stepId ? { ...s, completed: newCompleted } : s
                            ),
                        }
                        : t
                )
            );
        } catch {
            setError("Erro ao atualizar passo.");
        }
    };

    const handleStatusChange = async (taskId: string, status: Task["status"]) => {
        const apiStatus = mapUiStatusToApi(status);
        try {
            await taskRepository.updateTask(taskId, { status: apiStatus });
            setTasks((prev) =>
                prev.map((task) => (task.id === taskId ? { ...task, status } : task))
            );
        } catch {
            setError("Erro ao atualizar status.");
        }
    };

    const handleBreakSuggestion = () => {
        setShowBreakAlert(true);
    };

    const handleCreateTask = async () => {
        const title = newTaskTitle.trim();

        if (!title) {
            Alert.alert("Campo obrigatório", "Digite um título para a tarefa.");
            return;
        }

        try {
            const data = await taskRepository.createTask(title);
            const row = Array.isArray(data) ? data[0] : data;
            if (row) {
                const newTask: Task = {
                    id: row.id,
                    title: row.title,
                    steps: [],
                    status: "todo",
                };
                setTasks((prev) => [newTask, ...prev]);
            }
            setNewTaskTitle("");
            setIsAddTaskModalOpen(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao criar tarefa.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Box flex={1} bg="$white">
                <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                    <VStack style={{ padding: space(8)}}>
                        {/* Header */}
                        <HStack alignItems="flex-start" justifyContent="space-between" style={{ marginBottom: space(12) }}>
                            <HStack alignItems="center" flex={1} style={{ gap: space(16) }}>
                                <Box
                                    w="$12"
                                    h="$12"
                                    borderRadius="$xl"
                                    bg={contrastColors.primary}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <CheckSquare size={24} color="white" />
                                </Box>
                                <VStack flex={1}>
                                    <Text
                                        size="xl"
                                        fontWeight="$bold"
                                        color="$textLight900"
                                        style={{ fontSize: 24 * scale }}
                                    >
                                        Tarefas
                                    </Text>
                                    {!hideDescriptions && (
                                        <Text
                                            size="sm"
                                            color="$textLight500"
                                            style={{ fontSize: 14 * scale }}
                                        >
                                            Organize e execute sem sobrecarga
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>
                        </HStack>

                        <Pressable
                            onPress={() => setIsAddTaskModalOpen(true)}
                            bg={contrastColors.primary}
                            borderRadius="$xl"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            $active-opacity={reduceVisualStimuli ? 1 : 0.8}
                            style={{ paddingVertical: space(12), paddingHorizontal: space(16), gap: space(8), marginBottom: space(16) }}
                        >
                            <Plus size={20} color="white" />
                            <Text color="white" fontWeight="$medium" style={{ fontSize: 16 * scale }}>
                                Nova Tarefa
                            </Text>
                        </Pressable>

                        {error ? (
                            <Box bg="$error50" borderRadius="$xl" borderWidth={1} borderColor="$error200" style={{ padding: space(16), marginBottom: space(16) }}>
                                <Text color="$error700" style={{ fontSize: 14 * scale, marginBottom: space(12) }}>{error}</Text>
                                <Pressable onPress={fetchTasks} bg="$error500" borderRadius="$md" alignSelf="flex-start" style={{ paddingHorizontal: space(16), paddingVertical: space(8) }}>
                                    <Text color="$white" fontWeight="$semibold">Tentar novamente</Text>
                                </Pressable>
                            </Box>
                        ) : null}

                        {loading ? (
                            <Box alignItems="center" justifyContent="center" flexDirection="row" style={{ paddingVertical: space(16), gap: space(8), marginBottom: space(16) }}>
                                {!disableAnimations && <ActivityIndicator size="small" color={contrastColors.primary} />}
                                <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>Carregando tarefas...</Text>
                            </Box>
                        ) : null}

                        {/* Break alert */}
                        {showBreakAlert && (
                            <CognitiveAlert
                                type="break"
                                message="Ótimo trabalho! Hora de fazer uma pausa para recarregar."
                                onDismiss={() => setShowBreakAlert(false)}
                            />
                        )}

                        {/* Sidebar with timer (placed at top on mobile) */}
                        <PomodoroTimer onBreakSuggestion={handleBreakSuggestion} />

                        {/* Kanban columns as vertical sections */}

                        {/* A Fazer Section */}
                        <Box bg="$backgroundLight50" borderRadius="$xl" style={{ padding: space(16), marginBottom: space(20) }}>
                            <HStack justifyContent="space-between" alignItems="center" style={{ marginBottom: space(16) }}>
                                <Text fontWeight="$semibold" color="$textLight900">A Fazer</Text>
                                <Box bg="$backgroundLight200" borderRadius="$full" style={{ paddingHorizontal: space(8), paddingVertical: space(4) }}>
                                    <Text size="xs" color="$textLight500">{todoTasks.length}</Text>
                                </Box>
                            </HStack>
                            <VStack style={{ gap: space(16) }}>
                                {todoTasks.length === 0 ? (
                                    <Text size="sm" color="$textLight400" textAlign="center" style={{ paddingVertical: space(16) }}>
                                        Nenhuma tarefa pendente
                                    </Text>
                                ) : (
                                    todoTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onStepToggle={handleStepToggle}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </VStack>
                        </Box>

                        {/* Em Progresso Section */}
                        <Box bg="#F0FDFC" borderRadius="$xl" style={{ padding: space(16), marginBottom: space(20) }}>
                            <HStack justifyContent="space-between" alignItems="center" style={{ marginBottom: space(16) }}>
                                <Text fontWeight="$semibold" color="#0F766E">Em Progresso</Text>
                                <Box bg="#CCFBF1" borderRadius="$full" style={{ paddingHorizontal: space(8), paddingVertical: space(4) }}>
                                    <Text size="xs" color="#0F766E">{progressTasks.length}</Text>
                                </Box>
                            </HStack>
                            <VStack style={{ gap: space(16) }}>
                                {progressTasks.length === 0 ? (
                                    <Text size="sm" color="#14B8A6" textAlign="center" style={{ paddingVertical: space(16) }} opacity={reduceVisualStimuli ? 1 : 0.6}>
                                        Nenhuma tarefa em andamento
                                    </Text>
                                ) : (
                                    progressTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onStepToggle={handleStepToggle}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </VStack>
                        </Box>

                        {!focusMode && (
                            <Box bg="#F0FDF4" borderRadius="$xl" style={{ padding: space(16), marginBottom: space(20) }}>
                                <HStack justifyContent="space-between" alignItems="center" style={{ marginBottom: space(16) }}>
                                    <Text fontWeight="$semibold" color="#166534">Concluído</Text>
                                    <Box bg="#DCFCE7" borderRadius="$full" style={{ paddingHorizontal: space(8), paddingVertical: space(4) }}>
                                        <Text size="xs" color="#166534">{doneTasks.length}</Text>
                                    </Box>
                                </HStack>
                                <VStack style={{ gap: space(16) }}>
                                    {doneTasks.length === 0 ? (
                                        <Text size="sm" color="#22C55E" textAlign="center" style={{ paddingVertical: space(16) }} opacity={reduceVisualStimuli ? 1 : 0.6}>
                                            Nenhuma tarefa concluída
                                        </Text>
                                    ) : (
                                        doneTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onStepToggle={handleStepToggle}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))
                                    )}
                                </VStack>
                            </Box>
                        )}

                        {!focusMode && (
                            <Box alignItems="center" style={{ marginTop: space(16) }}>
                                <Text size="sm" color="$textLight500" textAlign="center">
                                    💡 Dica: Toque nos status das tarefas para acompanhar seu progresso
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </ScrollView>

                <Modal
                    visible={isAddTaskModalOpen}
                    transparent
                    animationType={disableAnimations ? "none" : "fade"}
                    onRequestClose={() => setIsAddTaskModalOpen(false)}
                >
                    <Box
                        flex={1}
                        justifyContent="center"
                        style={{ backgroundColor: "rgba(15, 23, 42, 0.45)", paddingHorizontal: space(20) }}
                    >
                        <Box
                            bg="$white"
                            borderRadius="$2xl"
                            borderWidth={1}
                            borderColor="$borderLight200"
                            style={{ padding: space(20) }}
                        >
                            <VStack style={{ gap: space(16) }}>
                                <VStack style={{ gap: space(6) }}>
                                    <Text fontWeight="$semibold" color="$textLight900" style={{ fontSize: 18 * scale }}>
                                        Nova Tarefa
                                    </Text>
                                    <Text size="sm" color="$textLight500" style={{ fontSize: 13 * scale }}>
                                        Adicione um título para criar a tarefa.
                                    </Text>
                                </VStack>

                                <Input variant="outline" size="xl" borderRadius="$xl" borderColor="$borderLight200">
                                    <InputField
                                        placeholder="Ex: Revisar resumo de matemática"
                                        value={newTaskTitle}
                                        onChangeText={setNewTaskTitle}
                                        autoFocus
                                        returnKeyType="done"
                                        onSubmitEditing={handleCreateTask}
                                    />
                                </Input>

                                <HStack style={{ gap: space(12) }}>
                                    <Pressable
                                        flex={1}
                                        borderRadius="$xl"
                                        alignItems="center"
                                        justifyContent="center"
                                        bg="$backgroundLight100"
                                        style={{ paddingVertical: space(14) }}
                                        onPress={() => {
                                            setIsAddTaskModalOpen(false);
                                            setNewTaskTitle("");
                                        }}
                                    >
                                        <Text color="$textLight700" fontWeight="$medium">Cancelar</Text>
                                    </Pressable>
                                    <Pressable
                                        flex={1}
                                        borderRadius="$xl"
                                        alignItems="center"
                                        justifyContent="center"
                                        bg={contrastColors.primary}
                                        style={{ paddingVertical: space(14) }}
                                        onPress={handleCreateTask}
                                    >
                                        <Text color="$white" fontWeight="$medium">Adicionar</Text>
                                    </Pressable>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </SafeAreaView>
    );
}
