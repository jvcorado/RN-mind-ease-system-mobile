export type ComplexityLevel = "simple" | "medium" | "detailed";

export type UserSettingsRow = {
    id?: string;
    user_id?: string;
    focus_mode_default?: boolean;
    summary_mode_default?: boolean;
    guided_rhythm?: boolean;
    font_size?: number;
    spacing?: number;
    contrast?: number;
    reduce_visual_stimuli?: boolean;
    disable_animations?: boolean;
    interface_rhythm?: number;
    complexity_level?: ComplexityLevel | string;
    focus_mode?: boolean;
    summary_mode?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type UserSettingsPayload = {
    complexity_level?: ComplexityLevel | string;
    focus_mode?: boolean;
    summary_mode?: boolean;
    guided_rhythm?: boolean;
    font_size?: number;
    spacing?: number;
    contrast?: number;
    focus_mode_default?: boolean;
    summary_mode_default?: boolean;
    reduce_visual_stimuli?: boolean;
    disable_animations?: boolean;
    interface_rhythm?: number;
    updated_at?: string;
};
