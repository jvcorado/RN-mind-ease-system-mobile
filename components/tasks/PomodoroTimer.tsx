import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, Pressable, HStack } from "@gluestack-ui/themed";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { useAppearance, useScaledSpace } from "@/contexts/AppearanceContext";

interface PomodoroTimerProps {
    onBreakSuggestion?: () => void;
}

export function PomodoroTimer({ onBreakSuggestion }: PomodoroTimerProps) {
    const space = useScaledSpace();
    const { contrastColors } = useAppearance();
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isBreak, setIsBreak] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = isBreak
        ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
        : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

    const reset = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    }, [isBreak]);

    const toggleBreak = () => {
        setIsBreak(!isBreak);
        setTimeLeft(!isBreak ? 5 * 60 : 25 * 60);
        setIsRunning(false);
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((t) => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            if (!isBreak) {
                onBreakSuggestion?.();
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, isBreak, onBreakSuggestion]);

    // SVG dimensions
    const size = 160;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Box bg="$white" borderRadius="$xl" borderWidth={1} borderColor="$borderLight200" style={{ padding: space(24), marginBottom: space(28) }}>
            <HStack justifyContent="space-between" alignItems="center" style={{ marginBottom: space(20) }}>
                <Text fontWeight="$bold" size="md">Timer de Foco</Text>
                <Pressable
                    onPress={toggleBreak}
                    bg={isBreak ? "#EEF2FF" : "$backgroundLight100"}
                    borderRadius="$lg"
                    flexDirection="row"
                    alignItems="center"
                    style={{ paddingHorizontal: space(12), paddingVertical: space(6), gap: space(8) }}
                >
                    <Coffee size={14} color={isBreak ? "#4F46E5" : "#64748b"} />
                    <Text size="xs" color={isBreak ? "#4F46E5" : "$textLight500"}>
                        {isBreak ? "Pausa" : "Foco"}
                    </Text>
                </Pressable>
            </HStack>

            <Box alignItems="center" style={{ marginBottom: space(24) }}>
                <Box width={size} height={size} position="relative" justifyContent="center" alignItems="center">
                    <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
                        {/* Background Circle */}
                        <Circle
                            stroke="#e2e8f0"
                            fill="none"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress Circle */}
                        <Circle
                            stroke={isBreak ? "#4F46E5" : contrastColors.primary}
                            fill="none"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </Svg>

                    <Box position="absolute" alignItems="center">
                        <Text size="3xl" fontWeight="$bold" style={{ fontVariant: ['tabular-nums'] }}>
                            {formatTime(timeLeft)}
                        </Text>
                        <Text size="xs" color="$textLight500" style={{ marginTop: space(4) }}>
                            {isBreak ? "Tempo de pausa" : "Tempo de foco"}
                        </Text>
                    </Box>
                </Box>
            </Box>

            <HStack justifyContent="center" alignItems="center" style={{ gap: space(20) }}>
                <Pressable
                    onPress={reset}
                    borderRadius="$xl"
                    bg="$backgroundLight100"
                    $active-bg="$backgroundLight200"
                    style={{ padding: space(14) }}
                >
                    <RotateCcw size={20} color="#64748b" />
                </Pressable>

                <Pressable
                    onPress={() => setIsRunning(!isRunning)}
                    borderRadius="$xl"
                    bg={isRunning ? "#F59E0B" : contrastColors.primary}
                    $active-opacity={0.8}
                    style={{ padding: space(18) }}
                >
                    {isRunning ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
                </Pressable>

                <Box width={44} />
            </HStack>
        </Box>
    );
}
