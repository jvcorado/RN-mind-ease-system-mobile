import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    InputField,
    InputSlot,
    Button,
    ButtonText,
    ButtonSpinner
} from '@gluestack-ui/themed';
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { authRepository } from '../data/repositories/authRepository';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Campos obrigatórios', 'Por favor, preencha o email e a senha.');
            return;
        }

        setIsLoading(true);

        try {
            await authRepository.signIn(email, password);
            // On success, the AuthContext in _layout.tsx will detect the session 
            // and automatically redirect the user to the `/(tabs)` group.
        } catch (error: any) {
            Alert.alert('Erro ao entrar', error.message || 'Verifique suas credenciais e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Box flex={1} bg="$white" justifyContent="center" p="$6">
                <VStack space="3xl" w="$full" maxWidth={400} alignSelf="center">
                    {/* Logo / Brand */}
                    <VStack alignItems="center" space="md" mb="$4">
                        <Box w="$16" h="$16" borderRadius="$2xl" bg="#3FA692" alignItems="center" justifyContent="center">
                            <Brain size={32} color="#ffffff" />
                        </Box>
                        <Text size="3xl" fontWeight="$bold" color="$textDark900">
                            MindEase
                        </Text>
                        <Text size="sm" color="$textLight500" textAlign="center">
                            Seu espaço de produtividade adaptativa
                        </Text>
                    </VStack>

                    {/* Login Card */}
                    <VStack
                        space="xl"
                        bg="$white"
                        p="$6"
                        borderRadius="$2xl"
                        borderWidth={1}
                        borderColor="$borderLight200"
                        shadowColor="$backgroundLight800"
                        shadowOffset={{ width: 0, height: 4 }}
                        shadowOpacity={0.1}
                        shadowRadius={12}
                        elevation={5}
                    >

                        {/* Form */}
                        <VStack space="lg">
                            {/* Email */}
                            <VStack space="xs">
                                <HStack space="xs" alignItems="center" mb="$1">
                                    <Mail size={16} color="#737373" />
                                    <Text size="sm" color="$textDark900" fontWeight="$medium">Email</Text>
                                </HStack>
                                <Input variant="outline" size="xl" borderRadius="$xl" borderColor="$borderLight200">
                                    <InputField
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </Input>
                            </VStack>

                            {/* Password */}
                            <VStack space="xs">
                                <HStack space="xs" alignItems="center" mb="$1">
                                    <Lock size={16} color="#737373" />
                                    <Text size="sm" color="$textDark900" fontWeight="$medium">Senha</Text>
                                </HStack>
                                <Input variant="outline" size="xl" borderRadius="$xl" borderColor="$borderLight200">
                                    <InputField
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChangeText={setPassword}
                                        autoCapitalize="none"
                                    />
                                    <InputSlot pr="$3" onPress={() => setShowPassword(!showPassword)}>
                                        <TouchableOpacity>
                                            {showPassword ? <EyeOff size={20} color="#737373" /> : <Eye size={20} color="#737373" />}
                                        </TouchableOpacity>
                                    </InputSlot>
                                </Input>
                            </VStack>

                            {/* Submit button */}
                            <Button
                                size="xl"
                                variant="solid"
                                bg="#3FA692"
                                borderRadius="$xl"
                                onPress={handleLogin}
                                isDisabled={isLoading}
                                mt="$2"
                            >
                                {isLoading && <ButtonSpinner mr="$2" color="white" />}
                                <ButtonText fontWeight="$semibold">Entrar</ButtonText>
                            </Button>
                        </VStack>

                        {/* Divider */}
                        <HStack alignItems="center" my="$2">
                            <Box flex={1} h={1} bg="$borderLight200" />
                            <Text px="$3" size="xs" color="$textLight400">
                                Ainda não tem uma conta?
                            </Text>
                            <Box flex={1} h={1} bg="$borderLight200" />
                        </HStack>

                        {/* Register link */}
                        <Button
                            size="xl"
                            variant="outline"
                            borderColor="$borderLight200"
                            borderRadius="$xl"
                            onPress={() => router.push('/register')}
                        >
                            <ButtonText color="$textDark900" fontWeight="$medium">Criar conta</ButtonText>
                        </Button>
                    </VStack>

                    {/* Footer */}
                    <Text size="xs" color="$textLight500" textAlign="center" mt="$4">
                        Ao continuar, você concorda com nossos{' '}
                        <Text size="xs" color="#3FA692" fontWeight="$medium">Termos de Uso</Text>{' '}
                        e{' '}
                        <Text size="xs" color="#3FA692" fontWeight="$medium">Política de Privacidade</Text>.
                    </Text>
                </VStack>
            </Box>
        </SafeAreaView>
    );
}
