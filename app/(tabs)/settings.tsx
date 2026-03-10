import { FontProvider, useFontScale } from "@/components/dashboard/FontContext";
import { useAppearance, useScaledSpace } from "@/contexts/AppearanceContext";
import { userSettingsRepository } from "@/data/repositories/userSettingsRepository";
import { Box, HStack, Pressable, ScrollView, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { Eye, Focus, Move, Settings as SettingsIcon, Sparkles, Sun, Timer, Type, Zap } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEBOUNCE_MS = 600;

interface SettingToggleProps {
    icon: React.ElementType;
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    scale?: number;
}

function SettingToggle({ icon: Icon, label, description, checked, onChange, scale = 1 }: SettingToggleProps) {
    return (
        <HStack alignItems="center" justifyContent="space-between" p="$4" borderRadius="$xl" bg="$backgroundLight50" sx={{
            _light: {
                bg: checked ? "#F0FDFC" : "$backgroundLight50",
            }
        }}>
            <HStack alignItems="center" gap="$4" flex={1} mr="$4">
                <Box
                    w="$10"
                    h="$10"
                    borderRadius="$xl"
                    alignItems="center"
                    justifyContent="center"
                    bg={checked ? "#3FA692" : "$backgroundLight200"}
                >
                    <Icon
                        size={20}
                        color={checked ? "white" : "#64748b"}
                    />
                </Box>
                <VStack flex={1}>
                    <Text fontWeight="$medium" color="$textLight900" style={{ fontSize: 14 * scale }}>{label}</Text>
                    <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>{description}</Text>
                </VStack>
            </HStack>
            <Switch
                size="md"
                value={checked}
                onValueChange={onChange}
                trackColor={{ false: "#e2e8f0", true: "#99f6e4" }}
                thumbColor="$white"
            />
        </HStack>
    );
}

interface SettingSliderProps {
    icon: React.ElementType;
    label: string;
    description: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    suffix?: string;
    scale?: number;
}

function SettingSlider({
    icon: Icon,
    label,
    description,
    value,
    onChange,
    min = 50,
    max = 150,
    suffix = "%",
    scale = 1
}: SettingSliderProps) {
    return (
        <Box p="$4" borderRadius="$xl" bg="$backgroundLight50">
            <HStack alignItems="center" gap="$4" mb="$4">
                <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight200" alignItems="center" justifyContent="center">
                    <Icon size={20} color="#64748b" />
                </Box>
                <VStack flex={1}>
                    <Text fontWeight="$medium" color="$textLight900" style={{ fontSize: 14 * scale }}>{label}</Text>
                    <Text size="xs" color="$textLight500" style={{ fontSize: 12 * scale }}>{description}</Text>
                </VStack>
                <Text size="sm" fontWeight="$semibold" color="#3FA692" style={{ fontSize: 14 * scale }}>
                    {value}{suffix}
                </Text>
            </HStack>
            <Slider
                minValue={min}
                maxValue={max}
                step={5}
                value={value}
                onChange={onChange}
                size="md"
                orientation="horizontal"
            >
                <SliderTrack bg="$backgroundLight200">
                    <SliderFilledTrack bg="#3FA692" />
                </SliderTrack>
                <SliderThumb bg="#3FA692" $active-bg="#0f766e" />
            </Slider>
        </Box>
    );
}

export default function SettingsScreen() {
    return <SettingsContent />;
}

function SettingsContent() {
    const hasLoadedOnce = useRef(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { setAppearance } = useAppearance();

    const [fontSize, setFontSize] = useState(100);
    const [focusDefault, setFocusDefault] = useState(false);
    const [reduceStimuli, setReduceStimuli] = useState(false);
    const [disableAnimations, setDisableAnimations] = useState(false);
    const [guidedRhythm, setGuidedRhythm] = useState(false);
    const [summaryDefault, setSummaryDefault] = useState(false);
    const [spacing, setSpacing] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [interfaceSpeed, setInterfaceSpeed] = useState(100);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userSettingsRepository.getUserSettings();
            if (data) {
                setFontSize(data.font_size ?? 100);
                setFocusDefault(!!data.focus_mode_default);
                setSummaryDefault(!!data.summary_mode_default);
                setGuidedRhythm(!!data.guided_rhythm);
                setReduceStimuli(!!data.reduce_visual_stimuli);
                setDisableAnimations(!!data.disable_animations);
                setSpacing(data.spacing ?? 100);
                setContrast(data.contrast ?? 100);
                setInterfaceSpeed(data.interface_rhythm ?? 100);
            }
            setTimeout(() => { hasLoadedOnce.current = true; }, 100);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar configurações.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchSettings();
        }, [fetchSettings])
    );

    const persistSettings = useCallback(() => {
        const payload = {
            focus_mode_default: focusDefault,
            summary_mode_default: summaryDefault,
            focus_mode: focusDefault,
            summary_mode: summaryDefault,
            guided_rhythm: guidedRhythm,
            font_size: fontSize,
            spacing,
            contrast,
            reduce_visual_stimuli: reduceStimuli,
            disable_animations: disableAnimations,
            interface_rhythm: interfaceSpeed,
        };
        userSettingsRepository.upsertUserSettings(payload).catch(() => {
            setError("Erro ao salvar. Tente novamente.");
        });
    }, [focusDefault, summaryDefault, guidedRhythm, fontSize, spacing, contrast, reduceStimuli, disableAnimations, interfaceSpeed]);

    useEffect(() => {
        setAppearance({ fontSize, spacing, contrast });
    }, [fontSize, spacing, contrast, setAppearance]);

    useEffect(() => {
        setAppearance({ summaryMode: summaryDefault, focusMode: focusDefault });
    }, [summaryDefault, focusDefault, setAppearance]);

    useEffect(() => {
        setAppearance({ reduceVisualStimuli: reduceStimuli, disableAnimations: disableAnimations });
    }, [reduceStimuli, disableAnimations, setAppearance]);

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
    }, [focusDefault, summaryDefault, guidedRhythm, fontSize, spacing, contrast, reduceStimuli, disableAnimations, interfaceSpeed, persistSettings]);

    const formProps = {
        focusDefault,
        setFocusDefault,
        reduceStimuli,
        setReduceStimuli,
        disableAnimations,
        setDisableAnimations,
        guidedRhythm,
        setGuidedRhythm,
        summaryDefault,
        setSummaryDefault,
        spacing,
        setSpacing,
        contrast,
        setContrast,
        interfaceSpeed,
        setInterfaceSpeed,
        fontSize,
        setFontSize,
        loading,
        error,
        fetchSettings,
    };

    return (
        <FontProvider fontSize={fontSize}>
            <SettingsForm {...formProps} />
        </FontProvider>
    );
}

type SettingsFormProps = {
    focusDefault: boolean;
    setFocusDefault: (v: boolean) => void;
    reduceStimuli: boolean;
    setReduceStimuli: (v: boolean) => void;
    disableAnimations: boolean;
    setDisableAnimations: (v: boolean) => void;
    guidedRhythm: boolean;
    setGuidedRhythm: (v: boolean) => void;
    summaryDefault: boolean;
    setSummaryDefault: (v: boolean) => void;
    spacing: number;
    setSpacing: (v: number) => void;
    contrast: number;
    setContrast: (v: number) => void;
    interfaceSpeed: number;
    setInterfaceSpeed: (v: number) => void;
    fontSize: number;
    setFontSize: (v: number) => void;
    loading: boolean;
    error: string | null;
    fetchSettings: () => void;
};

function SettingsForm({
    focusDefault, setFocusDefault,
    reduceStimuli, setReduceStimuli,
    disableAnimations, setDisableAnimations,
    guidedRhythm, setGuidedRhythm,
    summaryDefault, setSummaryDefault,
    spacing, setSpacing,
    contrast, setContrast,
    interfaceSpeed, setInterfaceSpeed,
    fontSize, setFontSize,
    loading, error, fetchSettings,
}: SettingsFormProps) {
    const { scale } = useFontScale();
    const space = useScaledSpace();
    const { complexityLevel, summaryMode, focusMode } = useAppearance();
    const hideDescriptions = complexityLevel === "simple" || summaryMode || focusMode;

    return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <Box flex={1} bg="$white">
                    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                        <VStack style={{ padding: space(16), paddingTop: space(16), gap: space(24) }}>
                            {/* Header */}
                            <HStack alignItems="center" style={{ gap: space(16), marginBottom: space(12) }}>
                                <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                    <SettingsIcon size={24} color="white" />
                                </Box>
                                <VStack>
                                    <Text size="xl" fontWeight="$bold" color="$textLight900" style={{ fontSize: 24 * scale }}>
                                        Configurações
                                    </Text>
                                    {!hideDescriptions && (
                                        <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>
                                            Personalize sua experiência por completo
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>

                            {error ? (
                                <Box bg="$error50" p="$4" borderRadius="$xl" borderWidth={1} borderColor="$error200">
                                    <Text color="$error700" mb="$3" style={{ fontSize: 14 * scale }}>{error}</Text>
                                    <Pressable onPress={fetchSettings} bg="$error500" px="$4" py="$2" borderRadius="$md" alignSelf="flex-start">
                                        <Text color="$white" fontWeight="$semibold">Tentar novamente</Text>
                                    </Pressable>
                                </Box>
                            ) : null}

                            {loading ? (
                                <Box py="$4" alignItems="center" justifyContent="center" flexDirection="row" gap="$2">
                                    {!disableAnimations && <ActivityIndicator size="small" color="#3FA692" />}
                                    <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>Carregando configurações...</Text>
                                </Box>
                            ) : null}

                            <VStack>
                            {/* Behavior settings */}
                            <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} style={{ padding: space(18), marginBottom: space(20) }}>
                                <HStack alignItems="center" gap="$2" mb="$5">
                                    <Zap size={20} color="#3FA692" />
                                    <Text fontWeight="$semibold" color="$textLight900" fontSize="$lg">
                                        Comportamento
                                    </Text>
                                </HStack>
                                <VStack style={{ gap: space(12) }}>
                                    <SettingToggle
                                        icon={Focus}
                                        label="Modo Foco Padrão"
                                        description="Iniciar sempre com o modo foco ativado"
                                        checked={focusDefault}
                                        onChange={setFocusDefault}
                                        scale={scale}
                                    />
                                    <SettingToggle
                                        icon={Eye}
                                        label="Modo Resumo Padrão"
                                        description="Mostrar apenas informações essenciais"
                                        checked={summaryDefault}
                                        onChange={setSummaryDefault}
                                        scale={scale}
                                    />
                                </VStack>
                            </Box>

                            {/* Visual settings */}
                            <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} style={{ padding: space(18), marginBottom: space(20) }}>
                                <HStack alignItems="center" gap="$2" mb="$5">
                                    <Sparkles size={20} color="#3FA692" />
                                    <Text fontWeight="$semibold" color="$textLight900" fontSize="$lg">
                                        Ajustes Visuais
                                    </Text>
                                </HStack>
                                <VStack style={{ gap: space(12) }}>
                                    <SettingSlider
                                        icon={Type}
                                        label="Tamanho da Fonte"
                                        description="Ajuste o tamanho do texto em toda a interface"
                                        value={fontSize}
                                        onChange={setFontSize}
                                        min={80}
                                        max={150}
                                        scale={scale}
                                    />
                                    <SettingSlider
                                        icon={Move}
                                        label="Espaçamento"
                                        description="Controle o espaço entre os elementos"
                                        value={spacing}
                                        onChange={setSpacing}
                                        min={80}
                                        max={150}
                                        scale={scale}
                                    />
                                    <SettingSlider
                                        icon={Sun}
                                        label="Contraste"
                                        description="Ajuste a intensidade das cores"
                                        value={contrast}
                                        onChange={setContrast}
                                        min={80}
                                        max={120}
                                        scale={scale}
                                    />
                                </VStack>
                            </Box>

                            {/* Accessibility settings */}
                            <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} style={{ padding: space(18), marginBottom: space(16) }}>
                                <HStack alignItems="center" gap="$2" mb="$5">
                                    <Eye size={20} color="#3FA692" />
                                    <Text fontWeight="$semibold" color="$textLight900" fontSize="$lg">
                                        Acessibilidade
                                    </Text>
                                </HStack>
                                <VStack style={{ gap: space(12) }}>
                                    <SettingToggle
                                        icon={Sparkles}
                                        label="Reduzir Estímulos Visuais"
                                        description="Minimizar animações e efeitos decorativos"
                                        checked={reduceStimuli}
                                        onChange={setReduceStimuli}
                                        scale={scale}
                                    />
                                    <SettingToggle
                                        icon={Zap}
                                        label="Desativar Animações"
                                        description="Remover todas as animações da interface"
                                        checked={disableAnimations}
                                        onChange={setDisableAnimations}
                                        scale={scale}
                                    />
                                    <SettingSlider
                                        icon={Timer}
                                        label="Ritmo da Interface"
                                        description="Velocidade das transições e feedbacks"
                                        value={interfaceSpeed}
                                        onChange={setInterfaceSpeed}
                                        min={50}
                                        max={150}
                                        scale={scale}
                                    />
                                </VStack>
                            </Box>

                            {/* Info footer */}
                            <Box alignItems="center" py="$6" px="$4">
                                <Text size="sm" color="$textLight500" textAlign="center" style={{ fontSize: 14 * scale }}>
                                    Suas preferências são salvas automaticamente e sincronizadas entre dispositivos.
                                </Text>
                            </Box>
                        </VStack>
                    </VStack>
                </ScrollView>
            </Box>
        </SafeAreaView>
    );
}
