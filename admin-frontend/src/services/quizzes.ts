import { api } from '@/lib/api';

export interface QuizOption {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id?: string;
    text: string;
    order: number;
    options: QuizOption[];
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    passScore: number;
    tutorialId?: string;
    questions: QuizQuestion[];
    createdAt: string;
}

export const quizzesService = {
    getAll: async (tutorialId?: string) => {
        const response = await api.get('/learning/quizzes', {
            params: { tutorialId }
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/learning/quizzes/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/learning/quizzes', data);
        return response.data;
    },

    getAttempts: async (id: string) => {
        const response = await api.get(`/learning/quizzes/${id}/attempts`);
        return response.data;
    }
};
