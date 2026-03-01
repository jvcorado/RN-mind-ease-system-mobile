import React, { useState } from "react";
import { Box, ScrollView, Text, VStack, HStack, Switch, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@gluestack-ui/themed";
import { Settings as SettingsIcon, Focus, Sun, Move, Type, Sparkles, Zap, Timer, Eye } from "lucide-react-native";
import { FontProvider, useFontScale } from "@/components/dashboard/FontContext";

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
                thumbColor={checked ? "#0d9488" : "#f1f5f9"}
                activeThumbColor="#0f766e"
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
    // Top level font size state for testing if we wanted to sync it global,
    // but here we just pass it to provider so the view is self-contained.
    const [fontSize, setFontSize] = useState(100);

    return (
        <FontProvider fontSize={fontSize}>
            <SettingsContent
                globalFontSize={fontSize}
                setGlobalFontSize={setFontSize}
            />
        </FontProvider>
    );
}

function SettingsContent({ globalFontSize, setGlobalFontSize }: { globalFontSize: number, setGlobalFontSize: (v: number) => void }) {
    const { scale } = useFontScale();

    // Toggle settings
    const [focusDefault, setFocusDefault] = useState(false);
    const [reduceStimuli, setReduceStimuli] = useState(true);
    const [disableAnimations, setDisableAnimations] = useState(false);
    const [guidedRhythm, setGuidedRhythm] = useState(true);
    const [summaryDefault, setSummaryDefault] = useState(false);

    // Slider settings
    const [spacing, setSpacing] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [interfaceSpeed, setInterfaceSpeed] = useState(100);

    return (
        <Box flex={1} bg="$white">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <VStack space="xl" p="$4" pt="$16">
                    {/* Header */}
                    <HStack alignItems="center" gap="$4" mb="$3">
                        <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                            <SettingsIcon size={24} color="white" />
                        </Box>
                        <VStack>
                            <Text size="xl" fontWeight="$bold" color="$textLight900" style={{ fontSize: 24 * scale }}>
                                Configurações
                            </Text>
                            <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>
                                Personalize sua experiência por completo
                            </Text>
                        </VStack>
                    </HStack>

                    <VStack space="2xl">
                        {/* Behavior settings */}
                        <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                            <HStack alignItems="center" gap="$2" mb="$5">
                                <Zap size={20} color="#3FA692" />
                                <Text fontWeight="$semibold" color="$textLight900" fontSize="$lg">
                                    Comportamento
                                </Text>
                            </HStack>
                            <VStack space="md">
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
                                <SettingToggle
                                    icon={Timer}
                                    label="Ritmo Guiado"
                                    description="Receber lembretes suaves de pausas e transições"
                                    checked={guidedRhythm}
                                    onChange={setGuidedRhythm}
                                    scale={scale}
                                />
                            </VStack>
                        </Box>

                        {/* Visual settings */}
                        <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                            <HStack alignItems="center" gap="$2" mb="$5">
                                <Sparkles size={20} color="#3FA692" />
                                <Text fontWeight="$semibold" color="$textLight900" fontSize="$lg">
                                    Ajustes Visuais
                                </Text>
                            </HStack>
                            <VStack space="md">
                                <SettingSlider
                                    icon={Type}
                                    label="Tamanho da Fonte"
                                    description="Ajuste o tamanho do texto em toda a interface"
                                    value={globalFontSize}
                                    onChange={setGlobalFontSize}
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
                        <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                            <HStack alignItems="center" gap="$2" mb="$5">
                                <Eye size={20} color="#3FA692" />
                                <Text fontWeight="$semibold" color="$textLight900" fontSize="$lg">
                                    Acessibilidade
                                </Text>
                            </HStack>
                            <VStack space="md">
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
    );
}
