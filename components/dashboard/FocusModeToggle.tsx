import React from "react";
import { Box, HStack, Switch, Text, VStack } from "@gluestack-ui/themed";
import { Focus, Eye, BookOpen } from "lucide-react-native";
import { useFontScale } from "./FontContext";

interface FocusModeToggleProps {
    focusMode: boolean;
    onFocusModeChange: (value: boolean) => void;
    summaryMode: boolean;
    onSummaryModeChange: (value: boolean) => void;
    readingMode: boolean;
    onReadingModeChange: (value: boolean) => void;
}

export function FocusModeToggle({
    focusMode,
    onFocusModeChange,
    summaryMode,
    onSummaryModeChange,
    readingMode,
    onReadingModeChange,
}: FocusModeToggleProps) {
    const { scale } = useFontScale();

    return (
        <Box space="md">
            <Text fontWeight="$semibold" color="$textLight900" mb="$4" style={{ fontSize: 16 * scale }}>
                Modos de Visualização
            </Text>

            {/* Focus Mode */}
            <HStack
                justifyContent="space-between"
                alignItems="center"
                p="$4"
                borderRadius="$xl"
                bg="#E3F2EE"
                mb="$4"
            >
                <HStack space="md" alignItems="center">
                    <Box
                        w="$10"
                        h="$10"
                        borderRadius="$xl"
                        alignItems="center"
                        justifyContent="center"
                        bg={focusMode ? "#3FA692" : "#F0F4F3"}
                    >
                        <Focus
                            size={20}
                            color={focusMode ? "white" : "#737373"}
                        />
                    </Box>
                    <VStack>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Modo Foco</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Remove distrações</Text>
                    </VStack>
                </HStack>
                <Switch
                    value={focusMode}
                    onValueChange={onFocusModeChange}
                    trackColor={{ false: "#767577", true: "#10B981" }} // Example secondary color
                />
            </HStack>

            {/* Summary Mode */}
            <HStack
                justifyContent="space-between"
                alignItems="center"
                p="$4"
                borderRadius="$xl"
                bg="#E3F2EE"
            >
                <HStack space="md" alignItems="center">
                    <Box
                        w="$10"
                        h="$10"
                        borderRadius="$xl"
                        alignItems="center"
                        justifyContent="center"
                        bg={summaryMode ? "#3FA692" : "#F0F4F3"}
                    >
                        <Eye
                            size={20}
                            color={summaryMode ? "white" : "#737373"}
                        />
                    </Box>
                    <VStack>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Modo Resumo</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Apenas o principal</Text>
                    </VStack>
                </HStack>
                <Switch
                    value={summaryMode}
                    onValueChange={onSummaryModeChange}
                    trackColor={{ false: "#767577", true: "#10B981" }} // Example secondary color
                />
            </HStack>

            {/* Reading Mode */}
            <HStack
                justifyContent="space-between"
                alignItems="center"
                p="$4"
                borderRadius="$xl"
                bg="#E3F2EE"
            >
                <HStack space="md" alignItems="center">
                    <Box
                        w="$10"
                        h="$10"
                        borderRadius="$xl"
                        alignItems="center"
                        justifyContent="center"
                        bg={readingMode ? "#3FA692" : "#F0F4F3"}
                    >
                        <BookOpen
                            size={20}
                            color={readingMode ? "white" : "#737373"}
                        />
                    </Box>
                    <VStack>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Modo Leitura</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Aumenta o texto</Text>
                    </VStack>
                </HStack>
                <Switch
                    value={readingMode}
                    onValueChange={onReadingModeChange}
                    trackColor={{ false: "#767577", true: "#10B981" }}
                />
            </HStack>
        </Box>
    );
}
