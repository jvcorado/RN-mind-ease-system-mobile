import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";
import { Move, Sun, Type } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

import { useAppearance } from "@/contexts/AppearanceContext";
import { useFontScale } from "./FontContext";

const TRACK_BAR_COLOR = "#94a3b8";

interface VisualControlsProps {
    fontSize: number;
    spacing: number;
    contrast: number;
    onFontSizeChange: (value: number) => void;
    onSpacingChange: (value: number) => void;
    onContrastChange: (value: number) => void;
}

export function VisualControls({
    fontSize,
    spacing,
    contrast,
    onFontSizeChange,
    onSpacingChange,
    onContrastChange,
}: VisualControlsProps) {
    const { scale } = useFontScale();
    const { contrastColors } = useAppearance();

    return (
        <Box>
            <Text fontWeight="$semibold" color="$textLight900" mt="$6" mb="$4" style={{ fontSize: 16 * scale }}>
                Ajustes Visuais
            </Text>

            {/* Font Size */}
            <VStack space="sm">
                <HStack space="md" alignItems="center">
                    <Box w="$10" h="$10" borderRadius="$xl" bg={contrastColors.primaryLight} alignItems="center" justifyContent="center">
                        <Type size={20} color={contrastColors.primary} />
                    </Box>
                    <Box flex={1}>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Tamanho da Fonte</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Atual: {fontSize}%</Text>
                    </Box>
                </HStack>
                <Slider
                    style={styles.slider}
                    value={fontSize}
                    onValueChange={(v) => onFontSizeChange(Math.round(v))}
                    minimumValue={80}
                    maximumValue={150}
                    step={5}
                    minimumTrackTintColor={contrastColors.primary}
                    maximumTrackTintColor={TRACK_BAR_COLOR}
                    thumbTintColor={contrastColors.primary}
                />
            </VStack>

            {/* Spacing */}
            <VStack space="sm" mt="$4">
                <HStack space="md" alignItems="center">
                    <Box w="$10" h="$10" borderRadius="$xl" bg={contrastColors.primaryLight} alignItems="center" justifyContent="center">
                        <Move size={20} color={contrastColors.primary} />
                    </Box>
                    <Box flex={1}>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Espaçamento</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Atual: {spacing}%</Text>
                    </Box>
                </HStack>
                <Slider
                    style={styles.slider}
                    value={spacing}
                    onValueChange={(v) => onSpacingChange(Math.round(v))}
                    minimumValue={80}
                    maximumValue={150}
                    step={5}
                    minimumTrackTintColor={contrastColors.primary}
                    maximumTrackTintColor={TRACK_BAR_COLOR}
                    thumbTintColor={contrastColors.primary}
                />
            </VStack>

            {/* Contrast */}
            <VStack space="sm" mt="$4">
                <HStack space="md" alignItems="center">
                    <Box w="$10" h="$10" borderRadius="$xl" bg={contrastColors.primaryLight} alignItems="center" justifyContent="center">
                        <Sun size={20} color={contrastColors.primary} />
                    </Box>
                    <Box flex={1}>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Contraste</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Atual: {contrast}%</Text>
                    </Box>
                </HStack>
                <Slider
                    style={styles.slider}
                    value={contrast}
                    onValueChange={(v) => onContrastChange(Math.round(v))}
                    minimumValue={65}
                    maximumValue={130}
                    step={5}
                    minimumTrackTintColor={contrastColors.primary}
                    maximumTrackTintColor={TRACK_BAR_COLOR}
                    thumbTintColor={contrastColors.primary}
                />
            </VStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    slider: {
        width: "100%",
        height: 40,
    },
});
