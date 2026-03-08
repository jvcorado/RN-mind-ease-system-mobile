import { supabase } from '../../lib/supabase';

export const authRepository = {
    async signUp(name: string, email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        if (data.user && data.user.identities?.length === 0) {
            throw new Error('Este email já está cadastrado.');
        }

        return data;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }
    },
};
