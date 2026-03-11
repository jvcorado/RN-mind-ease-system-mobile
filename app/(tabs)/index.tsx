import { useFontScale } from "@/components/dashboard/FontContext";
import { useAppearance, useScaledSpace } from "@/contexts/AppearanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { taskRepository } from "@/data/repositories/taskRepository";
import { Box, HStack, Pressable, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Brain,
  CheckSquare,
  Clock,
  ListChecks,
  Settings as SettingsIcon,
  Sparkles,
  TrendingUp,
  User
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.title = "Mind Ease - Home";
    }
  }, []);

  return <DashboardContent />;
}

function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { scale } = useFontScale();
  const space = useScaledSpace();
  const { complexityLevel, summaryMode, focusMode, reduceVisualStimuli, disableAnimations, contrastColors } = useAppearance();
  const hideDescriptions = complexityLevel === "simple" || summaryMode || focusMode;

  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Usuário';

  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    todo: 0,
    progress: 0,
    done: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskRepository.getTasks();
      const list = data ?? [];
      setTaskSummary({
        total: list.length,
        todo: list.filter((t: { status?: string }) => t.status === "todo").length,
        progress: list.filter((t: { status?: string }) => t.status === "in_progress").length,
        done: list.filter((t: { status?: string }) => t.status === "done").length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const completionRate = taskSummary.total > 0
    ? Math.round((taskSummary.done / taskSummary.total) * 100)
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} bg="$white">
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <VStack style={{ padding: space(16), paddingTop: space(16), gap: space(24) }}>
            {/* Header */}
            <HStack alignItems="center" style={{ gap: space(16), marginBottom: space(8) }}>
              <Box w="$12" h="$12" borderRadius="$xl" bg={contrastColors.primary} alignItems="center" justifyContent="center">
                <Sparkles size={24} color="white" />
              </Box>
              <VStack>
                <Text size="2xl" fontWeight="$bold" color="$textDark900" style={{ fontSize: 24 * scale }}>
                  Olá, {userName}!
                </Text>
                {!hideDescriptions && (
                  <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>
                    Aqui está um resumo do seu dia
                  </Text>
                )}
              </VStack>
            </HStack>

            {error ? (
              <Box bg="$error50" borderRadius="$xl" borderWidth={1} borderColor="$error200" style={{ padding: space(16), marginBottom: space(12) }}>
                <Text color="$error700" style={{ fontSize: 14 * scale, marginBottom: space(12) }}>{error}</Text>
                <Pressable onPress={fetchTasks} bg="$error500" borderRadius="$md" alignSelf="flex-start" style={{ paddingHorizontal: space(16), paddingVertical: space(8) }}>
                  <Text color="$white" fontWeight="$semibold">Tentar novamente</Text>
                </Pressable>
              </Box>
            ) : null}

            {!hideDescriptions && loading ? (
              <Box alignItems="center" justifyContent="center" flexDirection="row" style={{ paddingVertical: space(16), gap: space(8), marginBottom: space(16) }}>
                {!disableAnimations && <ActivityIndicator size="small" color={contrastColors.primary} />}
                <Text size="sm" color="$textLight500">Carregando tarefas...</Text>
              </Box>
            ) : null}
            <>
            {!hideDescriptions && (
              <VStack style={{ gap: space(12) }}>
                <HStack style={{ gap: space(12) }}>
                  <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center" p="$4">
                    <ListChecks size={24} color={contrastColors.primary} style={{ marginBottom: 8 }} />
                    <Text size="xl" fontWeight="$bold" color="$textDark900">{taskSummary.total}</Text>
                    <Text size="xs" color="$textLight500" textAlign="center">Total de Tarefas</Text>
                  </Box>
                  <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center" p="$4">
                    <Clock size={24} color="#F59E0B" style={{ marginBottom: 8 }} />
                    <Text size="xl" fontWeight="$bold" color="$textDark900">{taskSummary.progress}</Text>
                    <Text size="xs" color="$textLight500" textAlign="center">Em Progresso</Text>
                  </Box>
                </HStack>
                <HStack style={{ gap: space(12) }}>
                  <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center" p="$4">
                    <CheckSquare size={24} color="#10B981" style={{ marginBottom: 8 }} />
                    <Text size="xl" fontWeight="$bold" color="$textDark900">{taskSummary.done}</Text>
                    <Text size="xs" color="$textLight500" textAlign="center">Concluídas</Text>
                  </Box>
                  <Box flex={1} bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center" p="$4">
                    <TrendingUp size={24} color={contrastColors.primary} style={{ marginBottom: 8 }} />
                    <Text size="xl" fontWeight="$bold" color="$textDark900">{completionRate}%</Text>
                    <Text size="xs" color="$textLight500" textAlign="center">Taxa de Conclusão</Text>
                  </Box>
                </HStack>
              </VStack>
            )}

            {/* Feature cards list */}
            <VStack style={{ gap: space(16) }}>
              {/* Cognitive Panel */}
              <Pressable
                onPress={() => router.push('/(tabs)/cognitive-panel')}
                bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
                style={{ padding: space(16) }}
              >
                <HStack alignItems="center" justifyContent="space-between" style={{ marginBottom: space(12) }}>
                  <HStack alignItems="center" style={{ gap: space(12) }}>
                    <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                      <Brain size={20} color={contrastColors.primary} />
                    </Box>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 16 * scale }}>Painel Cognitivo</Text>
                  </HStack>
                  <ArrowRight size={16} color="#94a3b8" />
                </HStack>
                <Text size="sm" color="$textLight500" style={{ fontSize: 13 * scale, marginBottom: space(12) }}>
                  Ajuste a interface ao seu ritmo mental.
                </Text>
                <HStack flexWrap="wrap" style={{ gap: space(8) }}>
                  <Box bg="$backgroundLight100" borderRadius="$md" style={{ paddingHorizontal: space(8), paddingVertical: space(4) }}>
                    <Text size="xs" color="$textLight500">Complexidade: {complexityLevel === "simple" ? "Simples" : "Detalhado"}</Text>
                  </Box>
                  <Box bg="$backgroundLight100" borderRadius="$md" style={{ paddingHorizontal: space(8), paddingVertical: space(4) }}>
                    <Text size="xs" color="$textLight500">Foco: Inativo</Text>
                  </Box>
                </HStack>
              </Pressable>

              {/* Tasks */}
              <Pressable
                onPress={() => router.push('/(tabs)/tasks')}
                bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
                style={{ padding: space(16) }}
              >
                <HStack alignItems="center" justifyContent="space-between" style={{ marginBottom: space(12) }}>
                  <HStack alignItems="center" style={{ gap: space(12) }}>
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#DCFCE7" alignItems="center" justifyContent="center">
                      <CheckSquare size={20} color="#166534" />
                    </Box>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 16 * scale }}>Tarefas</Text>
                  </HStack>
                  <ArrowRight size={16} color="#94a3b8" />
                </HStack>
                <Text size="sm" color="$textLight500" style={{ fontSize: 13 * scale, marginBottom: space(12) }}>
                  Kanban, Pomodoro e checklists para o foco.
                </Text>
                <HStack style={{ gap: space(8) }}>
                  <Box flex={1} bg="$backgroundLight50" borderRadius="$lg" alignItems="center" style={{ padding: space(8) }}>
                    <Text fontWeight="$bold" color="$textDark900">{taskSummary.todo}</Text>
                    <Text size="2xs" color="$textLight500" textAlign="center">A fazer</Text>
                  </Box>
                  <Box flex={1} bg="$backgroundLight50" borderRadius="$lg" alignItems="center" style={{ padding: space(8) }}>
                    <Text fontWeight="$bold" color="$textDark900">{taskSummary.progress}</Text>
                    <Text size="2xs" color="$textLight500" textAlign="center">Andamento</Text>
                  </Box>
                  <Box flex={1} bg="$backgroundLight50" borderRadius="$lg" alignItems="center" style={{ padding: space(8) }}>
                    <Text fontWeight="$bold" color="$textDark900">{taskSummary.done}</Text>
                    <Text size="2xs" color="$textLight500" textAlign="center">Feitas</Text>
                  </Box>
                </HStack>
              </Pressable>

              {/* Profile */}
              <Pressable
                onPress={() => router.push('/(tabs)/profile')}
                bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
                style={{ padding: space(16) }}
              >
                <HStack alignItems="center" justifyContent="space-between" style={{ marginBottom: space(12) }}>
                  <HStack alignItems="center" style={{ gap: space(12) }}>
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#E0E7FF" alignItems="center" justifyContent="center">
                      <User size={20} color="#3730A3" />
                    </Box>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 16 * scale }}>Meu Perfil</Text>
                  </HStack>
                  <ArrowRight size={16} color="#94a3b8" />
                </HStack>
                <Text size="sm" color="$textLight500" style={{ fontSize: 13 * scale }}>
                  Informações pessoais e perfil cognitivo.
                </Text>
              </Pressable>

              {/* Settings */}
              <Pressable
                onPress={() => router.push('/(tabs)/settings')}
                bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
                style={{ padding: space(16) }}
              >
                <HStack alignItems="center" justifyContent="space-between" style={{ marginBottom: space(12) }}>
                  <HStack alignItems="center" style={{ gap: space(12) }}>
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#FFEDD5" alignItems="center" justifyContent="center">
                      <SettingsIcon size={20} color="#9A3412" />
                    </Box>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 16 * scale }}>Configurações</Text>
                  </HStack>
                  <ArrowRight size={16} color="#94a3b8" />
                </HStack>
                <Text size="sm" color="$textLight500" style={{ fontSize: 13 * scale }}>
                  Preferências persistentes para a interface.
                </Text>
              </Pressable>
            </VStack>

            {!hideDescriptions && (
              <Box bg={contrastColors.primaryLight} borderRadius="$xl" style={{ padding: space(16), marginTop: space(12) }}>
                <HStack alignItems="center" style={{ gap: space(16) }}>
                  {!reduceVisualStimuli && (
                    <Box w="$10" h="$10" borderRadius="$xl" bg={contrastColors.primary} alignItems="center" justifyContent="center" opacity={0.2} position="absolute" />
                  )}
                  <Sparkles size={20} color={contrastColors.primary} style={{ marginTop: 2, marginLeft: space(10) }} />
                  <VStack flex={1}>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 15 * scale, marginBottom: space(4) }}>Dica do dia</Text>
                    <Text size="sm" color="$textLight600" style={{ fontSize: 13 * scale, lineHeight: 20 }}>
                      {taskSummary.progress > 0
                        ? `Você tem ${taskSummary.progress} tarefa${taskSummary.progress > 1 ? 's' : ''} em progresso. Acesse a guia de Tarefas para continuar.`
                        : 'Que tal começar organizando suas tarefas do dia? Acesse as Tarefas e defina prioridades.'}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
            </>

          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
