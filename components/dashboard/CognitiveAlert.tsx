import React from "react";
import { Box, HStack, Pressable, Text } from "@gluestack-ui/themed";
import { Clock, Coffee, X } from "lucide-react-native";
import { useFontScale } from "./FontContext";

interface CognitiveAlertProps {
    type: "time" | "break";
    message: string;
    onDismiss: () => void;
}

export function CognitiveAlert({ type, message, onDismiss }: CognitiveAlertProps) {
    const { scale } = useFontScale();
    const isTime = type === "time";
    const bg = isTime ? "$amber100" : "$blue100";
    const iconColor = isTime ? "#D97706" : "#2563EB"; // Specific colors to match web themes roughly
    const textColor = isTime ? "$amber800" : "$blue800";

    return (
        <HStack
            bg={bg}
            p="$4"
            borderRadius="$xl"
            alignItems="center"
            justifyContent="space-between"
            mb="$4"
        >
            <HStack space="md" alignItems="center" flex={1}>
                <Box
                    w="$10"
                    h="$10"
                    borderRadius="$xl"
                    alignItems="center"
                    justifyContent="center"
                    bg={isTime ? "$amber200" : "$blue200"}
                    opacity={0.5}
                >
                    {/* Opacity handling might be tricky with simple bg prop, but acceptable for MVP */}
                    {isTime ? <Clock size={20} color={iconColor} /> : <Coffee size={20} color={iconColor} />}
                </Box>
                <Text size="sm" fontWeight="$medium" color={textColor} numberOfLines={2} flex={1} style={{ fontSize: 14 * scale }}>
                    {message}
                </Text>
            </HStack>
            <Pressable onPress={onDismiss} p="$2">
                <X size={16} color={iconColor} />
            </Pressable>
        </HStack>
    );
}
