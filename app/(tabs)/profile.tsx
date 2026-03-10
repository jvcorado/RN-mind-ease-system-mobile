import { useFontScale } from "@/components/dashboard/FontContext";
import { useAppearance, useScaledSpace } from "@/contexts/AppearanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { authRepository } from "@/data/repositories/authRepository";
import { userRepository, type ProfileRow } from "@/data/repositories/userRepository";
import { userSettingsRepository, type UserSettingsRow } from "@/data/repositories/userSettingsRepository";
import { Box, Button, ButtonIcon, ButtonText, HStack, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { Brain, LogOut, Settings, User } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const cognitiveProfile = {
    type: "Foco Adaptativo",
    description: "Prefere sessões curtas com pausas frequentes",
    strengths: ["Criatividade", "Resolução de problemas", "Pensamento visual"],
};

function formatComplexity(level: string | null | undefined): string {
    if (!level) return "—";
    if (level === "simple") return "Simples";
    if (level === "medium") return "Detalhado";
    if (level === "detailed") return "Detalhado";
    return level;
}

function formatMemberSince(createdAt: string | null | undefined): string {
    if (!createdAt) return "Membro";
    try {
        return "Membro desde " + new Date(createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    } catch {
        return "Membro";
    }
}

export default function ProfileScreen() {
    return <ProfileContent />;
}

function ProfileContent() {
    const { scale } = useFontScale();
    const space = useScaledSpace();
    const { complexityLevel, summaryMode, focusMode, reduceVisualStimuli, disableAnimations } = useAppearance();
    const { user } = useAuth();
    const hideDescriptions = complexityLevel === "simple" || summaryMode || focusMode;
    const [profile, setProfile] = useState<ProfileRow | null>(null);
    const [settings, setSettings] = useState<UserSettingsRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, settingsData] = await Promise.all([
                userRepository.getProfile(),
                userSettingsRepository.getUserSettings(),
            ]);
            setProfile(profileData ?? null);
            setSettings(settingsData ?? null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar perfil.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const displayName = profile?.name ?? user?.user_metadata?.name ?? "Usuário";
    const displayEmail = profile?.email ?? user?.email ?? null;
    const memberSince = formatMemberSince(profile?.created_at ?? null);

    const preferencesList = [
        { label: "Complexidade", value: formatComplexity(settings?.complexity_level) },
        { label: "Modo Foco", value: settings?.focus_mode ? "Ativado" : "Desativado" },
        { label: "Fonte", value: settings?.font_size != null ? `${settings.font_size}%` : "—" },
        { label: "Espaçamento", value: settings?.spacing != null ? `${settings.spacing}%` : "—" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Box flex={1} bg="$white">
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                    <VStack style={{ padding: space(16), paddingTop: space(16), gap: space(24) }}>
                        {/* Header */}
                        <HStack alignItems="center" justifyContent="space-between" style={{ marginBottom: space(12) }}>
                            <HStack alignItems="center" style={{ gap: space(16) }}>
                                <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                    <User size={24} color="white" />
                                </Box>
                                <VStack>
                                    <Text size="xl" fontWeight="$bold" color="$textLight900" style={{ fontSize: 24 * scale }}>
                                        Meu Perfil
                                    </Text>
                                    {!hideDescriptions && (
                                        <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>
                                            Suas informações e preferências
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>

                            <Button
                                variant="outline"
                                action="negative"
                                size="sm"
                                onPress={async () => {
                                    try {
                                        await authRepository.signOut();
                                    } catch (error) {
                                        Alert.alert('Erro', 'Não foi possível sair no momento.');
                                    }
                                }}
                            >
                                <ButtonIcon as={LogOut} mr="$2" />
                                <ButtonText>Sair</ButtonText>
                            </Button>
                        </HStack>

                        {error ? (
                            <Box bg="$error50" borderRadius="$xl" borderWidth={1} borderColor="$error200" style={{ padding: space(16), marginBottom: space(16) }}>
                                <Text color="$error700" style={{ fontSize: 14 * scale, marginBottom: space(12) }}>{error}</Text>
                                <Pressable onPress={fetchData} bg="$error500" borderRadius="$md" alignSelf="flex-start" style={{ paddingHorizontal: space(16), paddingVertical: space(8) }}>
                                    <Text color="$white" fontWeight="$semibold">Tentar novamente</Text>
                                </Pressable>
                            </Box>
                        ) : null}

                        {loading ? (
                            <Box alignItems="center" justifyContent="center" flexDirection="row" style={{ paddingVertical: space(16), gap: space(8), marginBottom: space(16) }}>
                                {!disableAnimations && <ActivityIndicator size="small" color="#3FA692" />}
                                <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>Carregando perfil...</Text>
                            </Box>
                        ) : null}

                        <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} style={{ padding: space(18), marginBottom: space(14) }}>
                            <VStack alignItems="center" style={{ gap: space(16) }}>
                                <Box w="$24" h="$24" borderRadius="$2xl" bg="#3FA692" opacity={reduceVisualStimuli ? 1 : 0.8} alignItems="center" justifyContent="center">
                                    <Text size="3xl" fontWeight="$bold" color="white">
                                        {displayName.slice(0, 2).toUpperCase()}
                                    </Text>
                                </Box>

                                <VStack alignItems="center" flex={1} style={{ gap: space(6) }}>
                                    <Text size="xl" fontWeight="$bold" color="$textLight900" style={{ marginBottom: space(4) }}>
                                        {displayName}
                                    </Text>
                                    {displayEmail ? (
                                        <Text size="sm" color="$textLight500" style={{ marginBottom: space(4) }}>{displayEmail}</Text>
                                    ) : null}
                                    <Text size="sm" color="$textLight500" style={{ marginBottom: space(16) }}>
                                        {memberSince}
                                    </Text>

                                    <HStack flexWrap="wrap" justifyContent="center" style={{ gap: space(8) }}>
                                        <Box borderRadius="$full" bg="#E3F2EE" style={{ paddingHorizontal: space(12), paddingVertical: space(6) }}>
                                            <Text size="sm" fontWeight="$medium" color="#3FA692">
                                                {cognitiveProfile.type}
                                            </Text>
                                        </Box>
                                        <Box borderRadius="$full" bg="$backgroundLight100" style={{ paddingHorizontal: space(12), paddingVertical: space(6) }}>
                                            <Text size="sm" fontWeight="$medium" color="$textLight700">
                                                Premium
                                            </Text>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>

                        <VStack style={{ gap: space(24) }}>
                            {!hideDescriptions && (
                                <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} style={{ padding: space(18) }}>
                                    <HStack alignItems="center" style={{ gap: space(12), marginBottom: space(16) }}>
                                        <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                                            <Brain size={20} color="#64748b" />
                                        </Box>
                                        <Text fontWeight="$semibold" color="$textLight900">Perfil Cognitivo</Text>
                                    </HStack>

                                    <Text size="sm" color="$textLight500" style={{ marginBottom: space(16) }}>
                                        {cognitiveProfile.description}
                                    </Text>

                                    <VStack style={{ gap: space(10) }}>
                                        <Text size="xs" color="$textLight500" textTransform="uppercase" letterSpacing="$sm">
                                            Pontos fortes
                                        </Text>
                                        <HStack flexWrap="wrap" style={{ gap: space(8) }}>
                                            {cognitiveProfile.strengths.map((strength) => (
                                                <Box key={strength} borderRadius="$lg" bg="#DCFCE7" style={{ paddingHorizontal: space(12), paddingVertical: space(6) }}>
                                                    <Text size="sm" color="#166534">{strength}</Text>
                                                </Box>
                                            ))}
                                        </HStack>
                                    </VStack>
                                </Box>
                            )}

                            {/* Active Preferences */}
                            <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} style={{ padding: space(18) }}>
                                <HStack alignItems="center" style={{ gap: space(12), marginBottom: space(16) }}>
                                    <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                                        <Settings size={20} color="#64748b" />
                                    </Box>
                                    <Text fontWeight="$semibold" color="$textLight900">Preferências Ativas</Text>
                                </HStack>

                                <VStack style={{ gap: space(8) }}>
                                    {preferencesList.map((pref, index) => (
                                        <HStack key={pref.label} justifyContent="space-between" alignItems="center" borderBottomWidth={index !== preferencesList.length - 1 ? 1 : 0} borderBottomColor="$borderLight100" style={{ paddingVertical: space(12) }}>
                                            <Text size="sm" color="$textLight500">{pref.label}</Text>
                                            <Text size="sm" fontWeight="$medium" color="$textLight900">{pref.value}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>
                        </VStack>
                    </VStack>
                </ScrollView>
            </Box>
        </SafeAreaView>
    );
}
