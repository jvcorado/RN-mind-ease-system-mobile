import React, { useState } from 'react';
import { Alert, TouchableOpacity, ScrollView } from 'react-native';
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
import { Brain, Mail, Lock, Eye, EyeOff, User, Sparkles } from 'lucide-react-native';
import { authRepository } from '../data/repositories/authRepository';

export default function RegisterScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!/[a-z]/.test(password)) {
            Alert.alert('Senha inválida', 'A senha deve conter pelo menos uma letra minúscula.');
            return;
        }

        if (!/[A-Z]/.test(password)) {
            Alert.alert('Senha inválida', 'A senha deve conter pelo menos uma letra maiúscula.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Senhas não coincidem', 'Verifique se as senhas digitadas são iguais.');
            return;
        }

        setIsLoading(true);

        try {
            await authRepository.signUp(name, email, password);

            Alert.alert(
                'Conta criada!',
                'Bem-vindo ao MindEase. Você já pode acessar sua conta.',
                [
                    { text: 'OK', onPress: () => router.replace('/login') }
                ]
            );
        } catch (error: any) {
            Alert.alert('Erro ao criar conta', error.message || 'Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Box flex={1} bg="$white">
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
                    <VStack space="3xl" w="$full" maxWidth={400} alignSelf="center" >
                        {/* Logo / Brand */}
                        <VStack alignItems="center" space="md" mb="$2">
                            <Box w="$16" h="$16" borderRadius="$2xl" bg="#3FA692" alignItems="center" justifyContent="center">
                                <Brain size={32} color="#ffffff" />
                            </Box>
                            <Text size="3xl" fontWeight="$bold" color="$textDark900">
                                MindEase
                            </Text>
                            <Text size="sm" color="$textLight500" textAlign="center">
                                Crie sua conta e comece sua jornada
                            </Text>
                        </VStack>

                        {/* Register Card */}
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
                                {/* Name */}
                                <VStack space="xs">
                                    <HStack space="xs" alignItems="center" mb="$1">
                                        <User size={16} color="#737373" />
                                        <Text size="sm" color="$textDark900" fontWeight="$medium">Nome</Text>
                                    </HStack>
                                    <Input variant="outline" size="xl" borderRadius="$xl" borderColor="$borderLight200">
                                        <InputField
                                            placeholder="Seu nome completo"
                                            value={name}
                                            onChangeText={setName}
                                            autoComplete="name"
                                        />
                                    </Input>
                                </VStack>

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
                                            placeholder="Mínimo 6 caracteres"
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

                                {/* Confirm Password */}
                                <VStack space="xs">
                                    <HStack space="xs" alignItems="center" mb="$1">
                                        <Lock size={16} color="#737373" />
                                        <Text size="sm" color="$textDark900" fontWeight="$medium">Confirmar senha</Text>
                                    </HStack>
                                    <Input variant="outline" size="xl" borderRadius="$xl" borderColor="$borderLight200">
                                        <InputField
                                            placeholder="Repita a senha"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            autoCapitalize="none"
                                        />
                                        <InputSlot pr="$3" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <TouchableOpacity>
                                                {showConfirmPassword ? <EyeOff size={20} color="#737373" /> : <Eye size={20} color="#737373" />}
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
                                    onPress={handleRegister}
                                    isDisabled={isLoading}
                                    mt="$2"
                                >
                                    {isLoading && <ButtonSpinner mr="$2" color="white" />}
                                    <ButtonText fontWeight="$semibold">Criar conta</ButtonText>
                                </Button>
                            </VStack>

                            {/* Divider */}
                            <HStack alignItems="center" my="$2">
                                <Box flex={1} h={1} bg="$borderLight200" />
                                <Text px="$3" size="xs" color="$textLight400">
                                    Já possui uma conta?
                                </Text>
                                <Box flex={1} h={1} bg="$borderLight200" />
                            </HStack>

                            {/* Login link */}
                            <Button
                                size="xl"
                                variant="outline"
                                borderColor="$borderLight200"
                                borderRadius="$xl"
                                onPress={() => router.push('/login')}
                            >
                                <ButtonText color="$textDark900" fontWeight="$medium">Entrar</ButtonText>
                            </Button>
                        </VStack>

                        {/* Footer */}
                        <Text size="xs" color="$textLight500" textAlign="center" mt="$4">
                            Ao criar sua conta, você concorda com nossos{' '}
                            <Text size="xs" color="#3FA692" fontWeight="$medium">Termos de Uso</Text>{' '}
                            e{' '}
                            <Text size="xs" color="#3FA692" fontWeight="$medium">Política de Privacidade</Text>.
                        </Text>
                    </VStack>
                </ScrollView>
            </Box>
        </SafeAreaView>
    );
}
