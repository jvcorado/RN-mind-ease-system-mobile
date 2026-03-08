import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, ScrollView, Text, VStack, HStack, Pressable } from "@gluestack-ui/themed";
import {
  Brain,
  CheckSquare,
  User,
  Settings as SettingsIcon,
  Sparkles,
  ArrowRight,
  ListChecks,
  Clock,
  TrendingUp
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useFontScale, FontProvider } from "@/components/dashboard/FontContext";
import { initialTasks } from "@/constants/tasks";

export default function DashboardScreen() {
  return (
    <FontProvider fontSize={100}>
      <DashboardContent />
    </FontProvider>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { scale } = useFontScale();

  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Usuário';

  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    todo: 0,
    progress: 0,
    done: 0,
  });

  useEffect(() => {
    // In a real app we would fetch from repository. For now we use the initialTasks constant.
    const summary = {
      total: initialTasks.length,
      todo: initialTasks.filter(t => t.status === 'todo').length,
      progress: initialTasks.filter(t => t.status === 'progress').length,
      done: initialTasks.filter(t => t.status === 'done').length,
    };
    setTaskSummary(summary);
  }, []);

  const completionRate = taskSummary.total > 0
    ? Math.round((taskSummary.done / taskSummary.total) * 100)
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} bg="$white">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <VStack space="2xl" p="$4" pt="$4">
            {/* Header */}
            <HStack alignItems="center" gap="$4" mb="$2">
              <Box w="$12" h="$12" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center">
                <Sparkles size={24} color="white" />
              </Box>
              <VStack>
                <Text size="2xl" fontWeight="$bold" color="$textDark900" style={{ fontSize: 24 * scale }}>
                  Olá, {userName}!
                </Text>
                <Text size="sm" color="$textLight500" style={{ fontSize: 14 * scale }}>
                  Aqui está um resumo do seu dia
                </Text>
              </VStack>
            </HStack>

            {/* Quick stats (2x2 grid) */}
            <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between">
              <Box w="48%" bg="$white" p="$3" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" mb="$3" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center">
                <ListChecks size={24} color="#3FA692" style={{ marginBottom: 8 }} />
                <Text size="xl" fontWeight="$bold" color="$textDark900">{taskSummary.total}</Text>
                <Text size="xs" color="$textLight500" textAlign="center">Total de Tarefas</Text>
              </Box>
              <Box w="48%" bg="$white" p="$3" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" mb="$3" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center">
                <Clock size={24} color="#F59E0B" style={{ marginBottom: 8 }} />
                <Text size="xl" fontWeight="$bold" color="$textDark900">{taskSummary.progress}</Text>
                <Text size="xs" color="$textLight500" textAlign="center">Em Progresso</Text>
              </Box>
              <Box w="48%" bg="$white" p="$3" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" mb="$3" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center">
                <CheckSquare size={24} color="#10B981" style={{ marginBottom: 8 }} />
                <Text size="xl" fontWeight="$bold" color="$textDark900">{taskSummary.done}</Text>
                <Text size="xs" color="$textLight500" textAlign="center">Concluídas</Text>
              </Box>
              <Box w="48%" bg="$white" p="$3" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" mb="$3" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1} alignItems="center">
                <TrendingUp size={24} color="#3FA692" style={{ marginBottom: 8 }} />
                <Text size="xl" fontWeight="$bold" color="$textDark900">{completionRate}%</Text>
                <Text size="xs" color="$textLight500" textAlign="center">Taxa de Conclusão</Text>
              </Box>
            </Box>

            {/* Feature cards list */}
            <VStack space="lg">
              {/* Cognitive Panel */}
              <Pressable
                onPress={() => router.push('/(tabs)/cognitive-panel')}
                bg="$white" p="$4" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
              >
                <HStack alignItems="center" justifyContent="space-between" mb="$3">
                  <HStack alignItems="center" gap="$3">
                    <Box w="$10" h="$10" borderRadius="$xl" bg="$backgroundLight100" alignItems="center" justifyContent="center">
                      <Brain size={20} color="#3FA692" />
                    </Box>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 16 * scale }}>Painel Cognitivo</Text>
                  </HStack>
                  <ArrowRight size={16} color="#94a3b8" />
                </HStack>
                <Text size="sm" color="$textLight500" mb="$3" style={{ fontSize: 13 * scale }}>
                  Ajuste a interface ao seu ritmo mental.
                </Text>
                <HStack flexWrap="wrap" gap="$2">
                  <Box bg="$backgroundLight100" px="$2" py="$1" borderRadius="$md">
                    <Text size="xs" color="$textLight500">Complexidade: Média</Text>
                  </Box>
                  <Box bg="$backgroundLight100" px="$2" py="$1" borderRadius="$md">
                    <Text size="xs" color="$textLight500">Foco: Inativo</Text>
                  </Box>
                </HStack>
              </Pressable>

              {/* Tasks */}
              <Pressable
                onPress={() => router.push('/(tabs)/tasks')}
                bg="$white" p="$4" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
              >
                <HStack alignItems="center" justifyContent="space-between" mb="$3">
                  <HStack alignItems="center" gap="$3">
                    <Box w="$10" h="$10" borderRadius="$xl" bg="#DCFCE7" alignItems="center" justifyContent="center">
                      <CheckSquare size={20} color="#166534" />
                    </Box>
                    <Text fontWeight="$semibold" color="$textDark900" style={{ fontSize: 16 * scale }}>Tarefas</Text>
                  </HStack>
                  <ArrowRight size={16} color="#94a3b8" />
                </HStack>
                <Text size="sm" color="$textLight500" mb="$3" style={{ fontSize: 13 * scale }}>
                  Kanban, Pomodoro e checklists para o foco.
                </Text>
                <HStack gap="$2">
                  <Box flex={1} bg="$backgroundLight50" p="$2" borderRadius="$lg" alignItems="center">
                    <Text fontWeight="$bold" color="$textDark900">{taskSummary.todo}</Text>
                    <Text size="2xs" color="$textLight500" textAlign="center">A fazer</Text>
                  </Box>
                  <Box flex={1} bg="$backgroundLight50" p="$2" borderRadius="$lg" alignItems="center">
                    <Text fontWeight="$bold" color="$textDark900">{taskSummary.progress}</Text>
                    <Text size="2xs" color="$textLight500" textAlign="center">Andamento</Text>
                  </Box>
                  <Box flex={1} bg="$backgroundLight50" p="$2" borderRadius="$lg" alignItems="center">
                    <Text fontWeight="$bold" color="$textDark900">{taskSummary.done}</Text>
                    <Text size="2xs" color="$textLight500" textAlign="center">Feitas</Text>
                  </Box>
                </HStack>
              </Pressable>

              {/* Profile */}
              <Pressable
                onPress={() => router.push('/(tabs)/profile')}
                bg="$white" p="$4" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
              >
                <HStack alignItems="center" justifyContent="space-between" mb="$3">
                  <HStack alignItems="center" gap="$3">
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
                bg="$white" p="$4" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" shadowColor="$backgroundLight900" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.05} shadowRadius={8} elevation={1}
                $active-bg="$backgroundLight50"
              >
                <HStack alignItems="center" justifyContent="space-between" mb="$3">
                  <HStack alignItems="center" gap="$3">
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

            {/* Quick Tip */}
            <Box bg="#E3F2EE" p="$4" borderRadius="$xl" mt="$2">
              <HStack alignItems="center" gap="$5">
                <Box w="$10" h="$10" borderRadius="$xl" bg="#3FA692" alignItems="center" justifyContent="center" opacity={0.2} position="absolute" />
                <Sparkles size={20} color="#3FA692" style={{ marginTop: 2, marginLeft: 10 }} />
                <VStack flex={1}>
                  <Text fontWeight="$semibold" color="$textDark900" mb="$1" style={{ fontSize: 15 * scale }}>Dica do dia</Text>
                  <Text size="sm" color="$textLight600" style={{ fontSize: 13 * scale, lineHeight: 20 }}>
                    {taskSummary.progress > 0
                      ? `Você tem ${taskSummary.progress} tarefa${taskSummary.progress > 1 ? 's' : ''} em progresso. Acesse a guia de Tarefas para continuar.`
                      : 'Que tal começar organizando suas tarefas do dia? Acesse as Tarefas e defina prioridades.'}
                  </Text>
                </VStack>
              </HStack>
            </Box>

          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
