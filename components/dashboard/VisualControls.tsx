import React from "react";
import { Box, HStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack } from "@gluestack-ui/themed";
import { Type, Move, Sun } from "lucide-react-native";
import { useFontScale } from "./FontContext";

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

    return (
        <Box>
            <Text fontWeight="$semibold" color="$textLight900" mt="$6" mb="$4" style={{ fontSize: 16 * scale }}>
                Ajustes Visuais
            </Text>

            {/* Font Size */}
            <VStack space="sm">
                <HStack space="md" alignItems="center">
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#E3F2EE" alignItems="center" justifyContent="center">
                        <Type size={20} color="#3FA692" />
                    </Box>
                    <Box flex={1}>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Tamanho da Fonte</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Atual: {fontSize}%</Text>
                    </Box>
                </HStack>
                <Slider
                    value={fontSize}
                    onChange={(value) => onFontSizeChange(Math.floor(value))}
                    minValue={80}
                    maxValue={150}
                    step={5}
                    w="$full"
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </VStack>

            {/* Spacing */}
            <VStack space="sm" mt="$4">
                <HStack space="md" alignItems="center">
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#E3F2EE" alignItems="center" justifyContent="center">
                        <Move size={20} color="#3FA692" />
                    </Box>
                    <Box flex={1}>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Espaçamento</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Atual: {spacing}%</Text>
                    </Box>
                </HStack>
                <Slider
                    value={spacing}
                    onChange={(value) => onSpacingChange(Math.floor(value))}
                    minValue={80}
                    maxValue={150}
                    step={5}
                    w="$full"
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </VStack>

            {/* Contrast */}
            <VStack space="sm" mt="$4">
                <HStack space="md" alignItems="center">
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#E3F2EE" alignItems="center" justifyContent="center">
                        <Sun size={20} color="#3FA692" />
                    </Box>
                    <Box flex={1}>
                        <Text size="sm" fontWeight="$medium" style={{ fontSize: 14 * scale }}>Contraste</Text>
                        <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>Atual: {contrast}%</Text>
                    </Box>
                </HStack>
                <Slider
                    value={contrast}
                    onChange={(value) => onContrastChange(Math.floor(value))}
                    minValue={80}
                    maxValue={120}
                    step={5}
                    w="$full"

                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </VStack>
        </Box>
    );
}
