import React from "react";
import { Box, HStack, VStack, Text, Pressable } from "@gluestack-ui/themed";
import { CheckCircle, Circle, GripVertical } from "lucide-react-native";
import type { Task } from "../../constants/tasks";

interface TaskCardProps {
    task: Task;
    onStepToggle: (taskId: string, stepId: string) => void;
    onStatusChange: (taskId: string, status: Task["status"]) => void;
}

export function TaskCard({ task, onStepToggle, onStatusChange }: TaskCardProps) {
    const completedSteps = task.steps.filter((s) => s.completed).length;
    const progress = task.steps.length > 0 ? (completedSteps / task.steps.length) * 100 : 0;

    return (
        <Box
            bg="$white"
            p="$4"
            borderRadius="$xl"
            borderWidth={1}
            borderColor="$borderLight200"
            mb="$3"
            shadowColor="$backgroundLight900"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.05}
            shadowRadius={8}
            elevation={1}
        >
            {/* Header */}
            <HStack alignItems="flex-start" gap="$3" mb="$4">
                <Box mt="$1">
                    <GripVertical size={16} color="#94a3b8" />
                </Box>
                <VStack flex={1}>
                    <Text fontWeight="$medium" color="$textLight900">{task.title}</Text>
                    {task.steps.length > 0 && (
                        <Text size="xs" color="$textLight500" mt="$1">
                            {completedSteps} de {task.steps.length} passos
                        </Text>
                    )}
                </VStack>
            </HStack>

            {/* Progress bar */}
            {task.steps.length > 0 && (
                <Box h="$1.5" bg="$backgroundLight200" borderRadius="$full" overflow="hidden" mb="$4">
                    <Box
                        h="$full"
                        bg="#3FA692"
                        borderRadius="$full"
                        width={`${progress}%`}
                    />
                </Box>
            )}

            {/* Steps */}
            <VStack space="sm">
                {task.steps.map((step) => (
                    <Pressable
                        key={step.id}
                        onPress={() => onStepToggle(task.id, step.id)}
                        flexDirection="row"
                        alignItems="center"
                        gap="$3"
                        p="$2"
                        borderRadius="$lg"
                        $active-bg="$backgroundLight100"
                    >
                        {step.completed ? (
                            <CheckCircle size={16} color="#3FA692" />
                        ) : (
                            <Circle size={16} color="#94a3b8" />
                        )}
                        <Text
                            size="sm"
                            color={step.completed ? "$textLight500" : "$textLight900"}
                            textDecorationLine={step.completed ? "line-through" : "none"}
                            flexShrink={1}
                        >
                            {step.text}
                        </Text>
                    </Pressable>
                ))}
            </VStack>

            {/* Quick status buttons */}
            <HStack gap="$2" mt="$4" pt="$4" borderTopWidth={1} borderTopColor="$borderLight100">
                {task.status !== "todo" && (
                    <Pressable
                        flex={1}
                        onPress={() => onStatusChange(task.id, "todo")}
                        bg="$backgroundLight100"
                        py="$2"
                        px="$3"
                        borderRadius="$lg"
                        alignItems="center"
                        $active-bg="$backgroundLight200"
                    >
                        <Text size="xs" color="$textLight700">A Fazer</Text>
                    </Pressable>
                )}
                {task.status !== "progress" && (
                    <Pressable
                        flex={1}
                        onPress={() => onStatusChange(task.id, "progress")}
                        bg="$backgroundLight100"
                        py="$2"
                        px="$3"
                        borderRadius="$lg"
                        alignItems="center"
                        $active-bg="#E3F2EE" // progress aesthetic
                    >
                        <Text size="xs" color="#3FA692" fontWeight="$medium">Em Progresso</Text>
                    </Pressable>
                )}
                {task.status !== "done" && (
                    <Pressable
                        flex={1}
                        onPress={() => onStatusChange(task.id, "done")}
                        bg="$backgroundLight100"
                        py="$2"
                        px="$3"
                        borderRadius="$lg"
                        alignItems="center"
                        $active-bg="#E2FAEB" // done aesthetic
                    >
                        <Text size="xs" color="#10B981" fontWeight="$medium">Concluído</Text>
                    </Pressable>
                )}
            </HStack>
        </Box>
    );
}
