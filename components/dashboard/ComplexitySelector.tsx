import { useAppearance } from "@/contexts/AppearanceContext";
import { Box, HStack, Pressable, Text } from "@gluestack-ui/themed";
import { Layers, LayoutList } from "lucide-react-native";
import React from "react";
import { useFontScale } from "./FontContext";

export type ComplexityOption = "simple" | "detailed";

interface ComplexitySelectorProps {
    value: "simple" | "medium" | "detailed";
    onChange: (value: ComplexityOption) => void;
}

const options: { value: ComplexityOption; label: string; description: string; icon: typeof LayoutList }[] = [
    {
        value: "simple",
        label: "Simples",
        description: "Menos informações",
        icon: LayoutList,
    },
    {
        value: "detailed",
        label: "Detalhado",
        description: "Tudo",
        icon: Layers,
    },
];

export function ComplexitySelector({ value, onChange }: ComplexitySelectorProps) {
    const { scale } = useFontScale();
    const { contrastColors } = useAppearance();
    const displayValue: ComplexityOption = value === "medium" ? "detailed" : value;

    return (
        <Box>
            <Text fontWeight="$semibold" mb="$4" color="$textLight900" style={{ fontSize: 16 * scale }}>
                Nível de Complexidade
            </Text>
            <HStack space="md">
                {options.map((option) => {
                    const isSelected = displayValue === option.value;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            flex={1}
                            borderWidth={2}
                            borderColor={isSelected ? contrastColors.primary : "transparent"}
                            backgroundColor={isSelected ? contrastColors.primaryLight : "#F0F4F3"}
                            borderRadius="$xl"
                            p="$4"
                            alignItems="center"
                        >
                            <option.icon
                                size={24}
                                color={isSelected ? contrastColors.primary : "#737373"}
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
