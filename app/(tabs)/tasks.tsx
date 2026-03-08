import React, { useState } from "react";
import { Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, ScrollView, Text, VStack, HStack, Pressable, Input, InputField } from "@gluestack-ui/themed";
import { CheckSquare, Plus } from "lucide-react-native";

import { FontProvider, useFontScale } from "@/components/dashboard/FontContext";
import { CognitiveAlert } from "@/components/dashboard/CognitiveAlert";
import { PomodoroTimer } from "@/components/tasks/PomodoroTimer";
import { TaskCard } from "@/components/tasks/TaskCard";
import { initialTasks, type Task } from "@/constants/tasks";

export default function TasksScreen() {
    const [fontSize] = useState(100);

    return (
        <FontProvider fontSize={fontSize}>
            <TasksContent />
        </FontProvider>
    );
}

function TasksContent() {
    const { scale } = useFontScale();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [showBreakAlert, setShowBreakAlert] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Separate tasks by status
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const progressTasks = tasks.filter((t) => t.status === "progress");
    const doneTasks = tasks.filter((t) => t.status === "done");

    const handleStepToggle = (taskId: string, stepId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        steps: task.steps.map((step) =>
                            step.id === stepId ? { ...step, completed: !step.completed } : step
                        ),
                    }
                    : task
            )
        );
    };

    const handleStatusChange = (taskId: string, status: Task["status"]) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, status } : task))
        );
    };

    const handleBreakSuggestion = () => {
        setShowBreakAlert(true);
    };

    const handleCreateTask = () => {
        const title = newTaskTitle.trim();

        if (!title) {
            Alert.alert("Campo obrigatório", "Digite um título para a tarefa.");
            return;
        }

        const newTask: Task = {
            id: `${Date.now()}`,
            title,
            steps: [],
            status: "todo",
        };

        setTasks((prev) => [newTask, ...prev]);
        setNewTaskTitle("");
        setIsAddTaskModalOpen(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Box flex={1} bg="$white">
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <VStack space="xl" p="$4" pt="$4">
                        {/* Header */}
                        <HStack alignItems="flex-start" justifyContent="space-between" mb="$2">
                            <HStack alignItems="center" gap="$4" flex={1}>
                                <Box
                                    w="$12"
                                    h="$12"
                                    borderRadius="$xl"
                                    bg="#3FA692"
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
                                    <Text
                                        size="sm"
                                        color="$textLight500"
                                        style={{ fontSize: 14 * scale }}
                                    >
                                        Organize e execute sem sobrecarga
                                    </Text>
                                </VStack>
                            </HStack>
                        </HStack>

                        <Pressable
                            onPress={() => setIsAddTaskModalOpen(true)}
                            bg="#3FA692"
                            py="$3"
                            px="$4"
                            borderRadius="$xl"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            gap="$2"
                            $active-opacity={0.8}
                            mb="$4"
                        >
                            <Plus size={20} color="white" />
                            <Text color="white" fontWeight="$medium" style={{ fontSize: 16 * scale }}>
                                Nova Tarefa
                            </Text>
                        </Pressable>

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
                        <Box bg="$backgroundLight50" p="$4" borderRadius="$xl" mb="$4">
                            <HStack justifyContent="space-between" alignItems="center" mb="$4">
                                <Text fontWeight="$semibold" color="$textLight900">A Fazer</Text>
                                <Box bg="$backgroundLight200" px="$2" py="$1" borderRadius="$full">
                                    <Text size="xs" color="$textLight500">{todoTasks.length}</Text>
                                </Box>
                            </HStack>
                            <VStack space="md">
                                {todoTasks.length === 0 ? (
                                    <Text size="sm" color="$textLight400" textAlign="center" py="$4">
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
                        <Box bg="#F0FDFC" p="$4" borderRadius="$xl" mb="$4">
                            <HStack justifyContent="space-between" alignItems="center" mb="$4">
                                <Text fontWeight="$semibold" color="#0F766E">Em Progresso</Text>
                                <Box bg="#CCFBF1" px="$2" py="$1" borderRadius="$full">
                                    <Text size="xs" color="#0F766E">{progressTasks.length}</Text>
                                </Box>
                            </HStack>
                            <VStack space="md">
                                {progressTasks.length === 0 ? (
                                    <Text size="sm" color="#14B8A6" textAlign="center" py="$4" opacity={0.6}>
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

                        {/* Concluído Section */}
                        <Box bg="#F0FDF4" p="$4" borderRadius="$xl" mb="$4">
                            <HStack justifyContent="space-between" alignItems="center" mb="$4">
                                <Text fontWeight="$semibold" color="#166534">Concluído</Text>
                                <Box bg="#DCFCE7" px="$2" py="$1" borderRadius="$full">
                                    <Text size="xs" color="#166534">{doneTasks.length}</Text>
                                </Box>
                            </HStack>
                            <VStack space="md">
                                {doneTasks.length === 0 ? (
                                    <Text size="sm" color="#22C55E" textAlign="center" py="$4" opacity={0.6}>
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

                        {/* Transition hint */}
                        <Box mt="$4" alignItems="center">
                            <Text size="sm" color="$textLight500" textAlign="center">
                                💡 Dica: Toque nos status das tarefas para acompanhar seu progresso
                            </Text>
                        </Box>
                    </VStack>
                </ScrollView>

                <Modal
                    visible={isAddTaskModalOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsAddTaskModalOpen(false)}
                >
                    <Box
                        flex={1}
                        justifyContent="center"
                        px="$4"
                        style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
                    >
                        <Box
                            bg="$white"
                            borderRadius="$2xl"
                            p="$5"
                            borderWidth={1}
                            borderColor="$borderLight200"
                        >
                            <VStack space="lg">
                                <VStack space="xs">
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

                                <HStack space="sm">
                                    <Pressable
                                        flex={1}
                                        py="$3"
                                        borderRadius="$xl"
                                        alignItems="center"
                                        justifyContent="center"
                                        bg="$backgroundLight100"
                                        onPress={() => {
                                            setIsAddTaskModalOpen(false);
                                            setNewTaskTitle("");
                                        }}
                                    >
                                        <Text color="$textLight700" fontWeight="$medium">Cancelar</Text>
                                    </Pressable>
                                    <Pressable
                                        flex={1}
                                        py="$3"
                                        borderRadius="$xl"
                                        alignItems="center"
                                        justifyContent="center"
                                        bg="#3FA692"
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
