import { Box, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { Brain, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ComplexitySelector } from "@/components/dashboard/ComplexitySelector";
import { FocusModeToggle } from "@/components/dashboard/FocusModeToggle";
import { FontProvider } from "@/components/dashboard/FontContext";
import { VisualControls } from "@/components/dashboard/VisualControls";
import { useAppearance, useScaledSpace } from "@/contexts/AppearanceContext";
import { userSettingsRepository, type ComplexityLevel } from "@/data/repositories/userSettingsRepository";

const DEBOUNCE_MS = 600;

export default function CognitivePanelScreen() {
    return <CognitivePanelContent />;
}

function CognitivePanelContent() {
    const [complexity, setComplexity] = useState<ComplexityLevel>("detailed");
    const [focusMode, setFocusMode] = useState(false);
    const [summaryMode, setSummaryMode] = useState(false);
    const [readingMode, setReadingMode] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [spacing, setSpacing] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasLoadedOnce = useRef(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { setAppearance, summaryMode: contextSummaryMode, focusMode: contextFocusMode, reduceVisualStimuli, disableAnimations } = useAppearance();

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userSettingsRepository.getUserSettings();
            if (data) {
                const level = (data.complexity_level as ComplexityLevel) || "detailed";
                const validLevel: ComplexityLevel = ["simple", "medium", "detailed"].includes(level) ? level : "detailed";
                setComplexity(validLevel);
                setFocusMode(!!data.focus_mode);
                setSummaryMode(!!data.summary_mode);
                setReadingMode(!!data.guided_rhythm);
                const font = data.font_size ?? 100;
                setFontSize(font);
                setSpacing(data.spacing ?? 100);
                setContrast(data.contrast ?? 100);
                setAppearance({
                    fontSize: data.font_size ?? 100,
                    spacing: data.spacing ?? 100,
                    contrast: data.contrast ?? 100,
                    complexityLevel: validLevel,
                    summaryMode: !!data.summary_mode,
                    focusMode: !!data.focus_mode,
                    reduceVisualStimuli: !!data.reduce_visual_stimuli,
                    disableAnimations: !!data.disable_animations,
                });
            }
            setTimeout(() => {
                hasLoadedOnce.current = true;
            }, 100);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar configurações.");
        } finally {
            setLoading(false);
        }
    }, [setAppearance]);

    useFocusEffect(
        useCallback(() => {
            fetchSettings();
        }, [fetchSettings])
    );

    const persistSettings = useCallback(() => {
        const payload = {
            complexity_level: complexity,
            focus_mode: focusMode,
            summary_mode: summaryMode,
            guided_rhythm: readingMode,
            font_size: fontSize,
            spacing,
            contrast,
            focus_mode_default: focusMode,
            summary_mode_default: summaryMode,
            reduce_visual_stimuli: reduceVisualStimuli,
            disable_animations: disableAnimations,
            interface_rhythm: 100,
        };
        userSettingsRepository.upsertUserSettings(payload).catch(() => {
            setError("Erro ao salvar. Tente novamente.");
        });
    }, [complexity, focusMode, summaryMode, readingMode, fontSize, spacing, contrast, reduceVisualStimuli, disableAnimations]);

    useEffect(() => {
        setAppearance({ fontSize, spacing, contrast, complexityLevel: complexity, summaryMode, focusMode });
    }, [fontSize, spacing, contrast, complexity, summaryMode, focusMode, setAppearance]);

    useEffect(() => {
        setSummaryMode(contextSummaryMode);
        setFocusMode(contextFocusMode);
    }, [contextSummaryMode, contextFocusMode]);

    useEffect(() => {
        if (!hasLoadedOnce.current) return;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            persistSettings();
            saveTimeoutRef.current = null;
        }, DEBOUNCE_MS);
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [complexity, focusMode, summaryMode, readingMode, fontSize, spacing, contrast, reduceVisualStimuli, disableAnimations, persistSettings]);

    const handleReadingModeChange = (enabled: boolean) => {
        setReadingMode(enabled);
        if (enabled) {
            setFontSize(125);
        } else {
            setFontSize(100);
        }
    };

    const scaleVal = fontSize / 100;
    const space = useScaledSpace();
    const hideDescriptions = complexity === "simple" || summaryMode || focusMode;

    return (
        <FontProvider fontSize={fontSize}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top', 'bottom', 'left', 'right']}>
                <Box flex={1} bg="$white">
                    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                        <VStack style={{ padding: space(16), paddingTop: space(16), gap: space(24) }}>
                            {/* Header */}
                            <Box flexDirection="row" alignItems="center" style={{ gap: space(16) }}>
                                <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                    <Brain size={24} color="white" />
                                </Box>
                                <VStack>
                                    <Text size="xl" fontWeight="$bold" style={{ fontSize: 20 * scaleVal }}>Painel Cognitivo</Text>
                                    {!hideDescriptions && (
                                        <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scaleVal }}>Ajuste a interface ao seu ritmo</Text>
                                    )}
                                </VStack>
                            </Box>

                            {error ? (
                                <Box bg="$error50" borderRadius="$xl" borderWidth={1} borderColor="$error200" style={{ padding: space(16) }}>
                                    <Text color="$error700" style={{ fontSize: 14 * scaleVal, marginBottom: space(12) }}>{error}</Text>
                                    <Pressable onPress={fetchSettings} bg="$error500" borderRadius="$md" alignSelf="flex-start" style={{ paddingHorizontal: space(16), paddingVertical: space(8) }}>
                                        <Text color="$white" fontWeight="$semibold">Tentar novamente</Text>
                                    </Pressable>
                                </Box>
                            ) : null}

                            {!hideDescriptions && (
                                <Box bg="#E3F2EE" borderRadius="$xl" style={{ padding: space(16) }}>
                                    <Box flexDirection="row" style={{ gap: space(12) }}>
                                        <Box w="$10" h="$10" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                            <Sparkles size={20} color="white" />
                                        </Box>
                                        <VStack flex={1}>
                                            <Text fontWeight="$semibold" style={{ fontSize: 16 * scaleVal }}>Bem-vindo ao seu espaço</Text>
                                            <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scaleVal, marginTop: space(4) }}>
                                                Este painel foi criado para você personalizar a interface conforme seu estado mental.
                                            </Text>
                                        </VStack>
                                    </Box>
                                </Box>
                            )}

                            {loading ? (
                                <Box alignItems="center" justifyContent="center" minHeight={200} style={{ paddingVertical: space(20) }}>
                                    {!disableAnimations && <ActivityIndicator size="large" color="#3FA692" />}
                                    <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scaleVal, marginTop: space(12) }}>Carregando configurações...</Text>
                                </Box>
                            ) : (
                            <>
                            <VStack>
                                <Box style={{ marginBottom: space(24) }}>
                                    <ComplexitySelector value={complexity} onChange={setComplexity} />
                                </Box>
                                <Box style={{ marginBottom: space(24) }}>
                                    <FocusModeToggle
                                        focusMode={focusMode}
                                        onFocusModeChange={setFocusMode}
                                        summaryMode={summaryMode}
                                        onSummaryModeChange={setSummaryMode}
                                        readingMode={readingMode}
                                        onReadingModeChange={handleReadingModeChange}
                                    />
                                </Box>
                                <Box>
                                    <VisualControls
                                        fontSize={fontSize}
                                        spacing={spacing}
                                        contrast={contrast}
                                        onFontSizeChange={setFontSize}
                                        onSpacingChange={setSpacing}
                                        onContrastChange={setContrast}
                                    />
                                </Box>
                            </VStack>

                            <Box alignItems="center" style={{ marginTop: space(16) }}>
                                <Text size="xs" color="$textLight400" style={{ fontSize: 12 * scaleVal }}>
                                    {focusMode ? "Modo foco ativo" : "Modo normal"} · Complexidade {complexity === "simple" ? "simples" : "detalhada"}
                                </Text>
                            </Box>
                            </>
                            )}

                        </VStack>
                    </ScrollView>
                </Box>
            </SafeAreaView>
        </FontProvider>
    );
}
