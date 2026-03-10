import { userSettingsRepository } from "@/data/repositories/userSettingsRepository";
import type { ComplexityLevel } from "@/data/repositories/userSettingsRepository";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type { ComplexityLevel };

export type AppearanceState = {
  fontSize: number;
  spacing: number;
  contrast: number;
  complexityLevel: ComplexityLevel;
  summaryMode: boolean;
  focusMode: boolean;
  reduceVisualStimuli: boolean;
  disableAnimations: boolean;
};

const defaults: AppearanceState = {
  fontSize: 100,
  spacing: 100,
  contrast: 100,
  complexityLevel: "detailed",
  summaryMode: false,
  focusMode: false,
  reduceVisualStimuli: false,
  disableAnimations: false,
};

type AppearanceContextType = AppearanceState & {
  /** Escala de fonte (fontSize / 100) para usar em fontSize: 14 * fontScale */
  fontScale: number;
  /** Escala de espaçamento (spacing / 100) para padding, margin, gap */
  spacingScale: number;
  /** Atualiza os valores (ex.: após salvar nas Configurações) */
  setAppearance: (next: Partial<AppearanceState>) => void;
  /** Reaplica valores a partir da API (ex.: ao focar nas tabs) */
  refreshFromApi: () => Promise<void>;
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppearanceState>(defaults);

  const refreshFromApi = useCallback(async () => {
    try {
      const data = await userSettingsRepository.getUserSettings();
      if (data) {
        const level = data.complexity_level as ComplexityLevel | undefined;
        const validLevel: ComplexityLevel =
          level && ["simple", "medium", "detailed"].includes(level) ? level : defaults.complexityLevel;
        setState({
          fontSize: data.font_size ?? defaults.fontSize,
          spacing: data.spacing ?? defaults.spacing,
          contrast: data.contrast ?? defaults.contrast,
          complexityLevel: validLevel,
          summaryMode: !!data.summary_mode,
          focusMode: !!data.focus_mode,
          reduceVisualStimuli: !!data.reduce_visual_stimuli,
          disableAnimations: !!data.disable_animations,
        });
      }
    } catch {
      // mantém defaults em caso de erro
    }
  }, []);

  useEffect(() => {
    refreshFromApi();
  }, [refreshFromApi]);

  const setAppearance = useCallback((next: Partial<AppearanceState>) => {
    setState((prev) => ({
      ...prev,
      ...next,
    }));
  }, []);

  const value: AppearanceContextType = {
    ...state,
    fontScale: state.fontSize / 100,
    spacingScale: state.spacing / 100,
    setAppearance,
    refreshFromApi,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (ctx === undefined) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return ctx;
}

/** Retorna um valor de espaço escalado (ex.: space(16) para padding). Use em style. */
export function useScaledSpace() {
  const { spacingScale } = useAppearance();
  return useCallback(
    (pixels: number) => Math.round(pixels * spacingScale),
    [spacingScale]
  );
}
