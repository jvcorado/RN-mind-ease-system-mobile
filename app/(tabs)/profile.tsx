import React, { useState } from "react";
import { Box, ScrollView, Text, VStack, HStack } from "@gluestack-ui/themed";
import { User, Brain, Calendar, Settings, Sparkles } from "lucide-react-native";
import { FontProvider, useFontScale } from "@/components/dashboard/FontContext";

const cognitiveProfile = {
    type: "Foco Adaptativo",
    description: "Prefere sessões curtas com pausas frequentes",
    strengths: ["Criatividade", "Resolução de problemas", "Pensamento visual"],
};

const routines = [
    { id: "1", name: "Rotina Matinal", time: "07:00", active: true },
    { id: "2", name: "Bloco de Estudos", time: "09:00", active: true },
    { id: "3", name: "Pausa Ativa", time: "12:00", active: false },
    { id: "4", name: "Revisão Noturna", time: "20:00", active: true },
];

const preferences = [
    { label: "Complexidade", value: "Médio" },
    { label: "Modo Foco", value: "Desativado" },
    { label: "Fonte", value: "100%" },
    { label: "Espaçamento", value: "100%" },
];

export default function ProfileScreen() {
    const [fontSize] = useState(100);

    return (
        <FontProvider fontSize={fontSize}>
            <ProfileContent />
        </FontProvider>
    );
}

function ProfileContent() {
    const { scale } = useFontScale();

    return (
        <Box flex={1} bg="$white">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <VStack space="xl" p="$4" pt="$16">
                    {/* Header */}
                    <HStack alignItems="center" gap="$4" mb="$3">
                        <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                            <User size={24} color="white" />
                        </Box>
                        <VStack>
                            <Text size="xl" fontWeight="$bold" color="$textLight900" style={{ fontSize: 24 * scale }}>
                                Meu Perfil
                            </Text>
                            <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>
                                Suas informações e preferências
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Profile Card */}
                    <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" mb="$2" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                        <VStack sm={{ flexDirection: "row", alignItems: "flex-start" }} alignItems="center" gap="$5">
                            {/* Avatar */}
                            <Box w="$24" h="$24" borderRadius="$2xl" bg="#3FA692" opacity={0.8} alignItems="center" justifyContent="center">
                                <Text size="3xl" fontWeight="$bold" color="white">ME</Text>
                            </Box>

                            {/* Info */}
                            <VStack alignItems="center" sm={{ alignItems: "flex-start" }} flex={1}>
                                <Text size="xl" fontWeight="$bold" color="$textLight900" mb="$1">
                                    Usuário MindEase
                                </Text>
                                <Text size="sm" color="$textLight500" mb="$4">
                                    Membro desde Janeiro 2024
                                </Text>

                                <HStack flexWrap="wrap" justifyContent="center" sm={{ justifyContent: "flex-start" }} gap="$2">
                                    <Box px="$3" py="$1.5" borderRadius="$full" bg="#E3F2EE">
                                        <Text size="sm" fontWeight="$medium" color="#3FA692">
                                            {cognitiveProfile.type}
                                        </Text>
                                    </Box>
                                    <Box px="$3" py="$1.5" borderRadius="$full" bg="$backgroundLight100">
                                        <Text size="sm" fontWeight="$medium" color="$textLight700">
                                            Premium
                                        </Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Content Grid (Stacked on mobile) */}
                    <VStack space="xl">
                        {/* Cognitive Profile */}
                        <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                            <HStack alignItems="center" gap="$3" mb="$4">
                                <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                                    <Brain size={20} color="#64748b" />
                                </Box>
                                <Text fontWeight="$semibold" color="$textLight900">Perfil Cognitivo</Text>
                            </HStack>

                            <Text size="sm" color="$textLight500" mb="$4">
                                {cognitiveProfile.description}
                            </Text>

                            <VStack space="sm">
                                <Text size="xs" color="$textLight500" textTransform="uppercase" letterSpacing="$sm">
                                    Pontos fortes
                                </Text>
                                <HStack flexWrap="wrap" gap="$2">
                                    {cognitiveProfile.strengths.map((strength) => (
                                        <Box key={strength} px="$3" py="$1.5" borderRadius="$lg" bg="#DCFCE7">
                                            <Text size="sm" color="#166534">{strength}</Text>
                                        </Box>
                                    ))}
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Active Preferences */}
                        <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                            <HStack alignItems="center" gap="$3" mb="$4">
                                <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                                    <Settings size={20} color="#64748b" />
                                </Box>
                                <Text fontWeight="$semibold" color="$textLight900">Preferências Ativas</Text>
                            </HStack>

                            <VStack space="sm">
                                {preferences.map((pref, index) => (
                                    <HStack key={pref.label} justifyContent="space-between" alignItems="center" py="$2" borderBottomWidth={index !== preferences.length - 1 ? 1 : 0} borderBottomColor="$borderLight100">
                                        <Text size="sm" color="$textLight500">{pref.label}</Text>
                                        <Text size="sm" fontWeight="$medium" color="$textLight900">{pref.value}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>

                        {/* Routines */}
                        <Box bg="$white" p="$5" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}>
                            <HStack alignItems="center" gap="$3" mb="$4">
                                <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                                    <Calendar size={20} color="#64748b" />
                                </Box>
                                <Text fontWeight="$semibold" color="$textLight900">Minhas Rotinas</Text>
                            </HStack>

                            <VStack space="sm">
                                {routines.map((routine) => (
                                    <HStack
                                        key={routine.id}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        p="$4"
                                        borderRadius="$xl"
                                        bg={routine.active ? "#E3F2EE" : "$backgroundLight50"}
                                    >
                                        <HStack alignItems="center" gap="$3">
                                            <Sparkles size={16} color={routine.active ? "#3FA692" : "#94a3b8"} />
                                            <VStack>
                                                <Text size="sm" fontWeight="$medium" color="$textLight900">{routine.name}</Text>
                                                <Text size="xs" color="$textLight500">{routine.time}</Text>
                                            </VStack>
                                        </HStack>
                                        <Box px="$2" py="$1" borderRadius="$full" bg={routine.active ? "#DCFCE7" : "$backgroundLight200"}>
                                            <Text size="xs" color={routine.active ? "#166534" : "$textLight500"}>
                                                {routine.active ? "Ativa" : "Pausada"}
                                            </Text>
                                        </Box>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}
