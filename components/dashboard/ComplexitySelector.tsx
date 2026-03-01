import React from "react";
import { Box, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";
import { Layers, LayoutGrid, LayoutList } from "lucide-react-native";
import { useFontScale } from "./FontContext";

interface ComplexitySelectorProps {
    value: "simple" | "medium" | "detailed";
    onChange: (value: "simple" | "medium" | "detailed") => void;
}

const options = [
    {
        value: "simple" as const,
        label: "Simples",
        description: "Menos informações",
        icon: LayoutList,
    },
    {
        value: "medium" as const,
        label: "Médio",
        description: "Equilíbrio",
        icon: LayoutGrid,
    },
    {
        value: "detailed" as const,
        label: "Detalhado",
        description: "Tudo",
        icon: Layers,
    },
];

export function ComplexitySelector({ value, onChange }: ComplexitySelectorProps) {
    const { scale } = useFontScale();

    return (
        <Box>
            <Text fontWeight="$semibold" mb="$4" color="$textLight900" style={{ fontSize: 16 * scale }}>
                Nível de Complexidade
            </Text>
            <HStack space="md">
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            flex={1}
                            borderWidth={2}
                            borderColor={isSelected ? "#3FA692" : "transparent"}
                            backgroundColor={isSelected ? "#E3F2EE" : "#F0F4F3"}
                            borderRadius="$xl"
                            p="$4"
                            alignItems="center"
                        >
                            <option.icon
                                size={24}
                                color={isSelected ? "#3FA692" : "#737373"} // Adjust colors as needed
                            />
                            <Text size="sm" fontWeight="$medium" mt="$2" style={{ fontSize: 14 * scale }}>
                                {option.label}
                            </Text>
                            <Text size="xs" color="$textLight500" textAlign="center" mt="$1" style={{ fontSize: 12 * scale }}>
                                {option.description}
                            </Text>
                        </Pressable>
                    )
                })}
            </HStack>
        </Box>
    );
}
