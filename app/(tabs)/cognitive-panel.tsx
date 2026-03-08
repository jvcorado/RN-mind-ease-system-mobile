import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { Brain, Sparkles } from "lucide-react-native";

import { ComplexitySelector } from "@/components/dashboard/ComplexitySelector";
import { FocusModeToggle } from "@/components/dashboard/FocusModeToggle";
import { VisualControls } from "@/components/dashboard/VisualControls";
import { CognitiveAlert } from "@/components/dashboard/CognitiveAlert";
import { FontProvider } from "@/components/dashboard/FontContext";

export default function CognitivePanelScreen() {
    const [complexity, setComplexity] = useState<"simple" | "medium" | "detailed">("medium");
    const [focusMode, setFocusMode] = useState(false);
    const [summaryMode, setSummaryMode] = useState(false);
    const [readingMode, setReadingMode] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [spacing, setSpacing] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [alerts, setAlerts] = useState([
        { id: "1", type: "break" as const, message: "Você está focado há 45 minutos. Que tal uma pausa?" },
    ]);

    const dismissAlert = (id: string) => {
        setAlerts(alerts.filter((a) => a.id !== id));
    };

    const handleReadingModeChange = (enabled: boolean) => {
        setReadingMode(enabled);
        if (enabled) {
            setFontSize(125);
        } else {
            setFontSize(100);
        }
    };

    const scale = fontSize / 100;

    return (
        <FontProvider fontSize={fontSize}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'bottom', 'left', 'right']}>
                <Box flex={1} bg="$white">
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <VStack space="xl" p="$4" pt="$4">
                            {/* Header */}
                            <Box flexDirection="row" alignItems="center" gap="$4">
                                <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                    <Brain size={24} color="white" />
                                </Box>
                                <VStack>
                                    <Text size="xl" fontWeight="$bold" style={{ fontSize: 20 * scale }}>Painel Cognitivo</Text>
                                    <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>Ajuste a interface ao seu ritmo</Text>
                                </VStack>
                            </Box>

                            {/* Alerts */}
                            {alerts.map((alert) => (
                                <CognitiveAlert
                                    key={alert.id}
                                    type={alert.type}
                                    message={alert.message}
                                    onDismiss={() => dismissAlert(alert.id)}
                                />
                            ))}

                            {/* Welcome Card */}
                            <Box
                                bg="#E3F2EE" // Gradient fallback
                                p="$4"
                                borderRadius="$xl"
                            >
                                <Box flexDirection="row" gap="$3">
                                    <Box w="$10" h="$10" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                        <Sparkles size={20} color="white" />
                                    </Box>
                                    <VStack flex={1}>
                                        <Text fontWeight="$semibold" style={{ fontSize: 16 * scale }}>Bem-vindo ao seu espaço</Text>
                                        <Text size="sm" color="$textLight500" mt="$1" style={{ fontSize: 14 * scale }}>
                                            Este painel foi criado para você personalizar a interface conforme seu estado mental.
                                        </Text>
                                    </VStack>
                                </Box>
                            </Box>

                            {/* Controls */}
                            <VStack space="xl">
                                <ComplexitySelector value={complexity} onChange={setComplexity} />

                                <FocusModeToggle
                                    focusMode={focusMode}
                                    onFocusModeChange={setFocusMode}
                                    summaryMode={summaryMode}
                                    onSummaryModeChange={setSummaryMode}
                                    readingMode={readingMode}
                                    onReadingModeChange={handleReadingModeChange}
                                />

                                <VisualControls
                                    fontSize={fontSize}
                                    spacing={spacing}
                                    contrast={contrast}
                                    onFontSizeChange={setFontSize}
                                    onSpacingChange={setSpacing}
                                    onContrastChange={setContrast}
                                />
                            </VStack>

                            {/* Status Indicator */}
                            <Box alignItems="center" mt="$4">
                                <Text size="xs" color="$textLight400" style={{ fontSize: 12 * scale }}>
                                    {focusMode ? "Modo foco ativo" : "Modo normal"} · Complexidade {complexity === "simple" ? "simples" : complexity === "medium" ? "média" : "detalhada"}
                                </Text>
                            </Box>

                        </VStack>
                    </ScrollView>
                </Box>
            </SafeAreaView>
        </FontProvider>
    );
}
