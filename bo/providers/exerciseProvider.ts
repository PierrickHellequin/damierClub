import { apiProvider } from './apiProvider';
import type {
  Exercise,
  ExerciseFormData,
  ExercisePage,
  ExerciseStatus,
} from '../types/exercise';

const exerciseProvider = {
  async getExercises(filters: {
    page?: number;
    size?: number;
    status?: ExerciseStatus;
  } = {}): Promise<ExercisePage> {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.status) params.append('status', filters.status);
    const qs = params.toString();
    return apiProvider.call<ExercisePage>({
      url: qs ? `exercises?${qs}` : 'exercises',
      method: 'GET',
    });
  },

  async getExercise(id: string): Promise<Exercise> {
    return apiProvider.call<Exercise>({ url: `exercises/${id}`, method: 'GET' });
  },

  async createExercise(data: ExerciseFormData): Promise<Exercise> {
    return apiProvider.call<Exercise>({
      url: 'exercises',
      method: 'POST',
      body: data,
    });
  },

  async updateExercise(id: string, data: Partial<ExerciseFormData>): Promise<Exercise> {
    return apiProvider.call<Exercise>({
      url: `exercises/${id}`,
      method: 'PUT',
      body: data,
    });
  },

  async publishExercise(id: string): Promise<Exercise> {
    return apiProvider.call<Exercise>({
      url: `exercises/${id}/publish`,
      method: 'PATCH',
    });
  },

  async unpublishExercise(id: string): Promise<Exercise> {
    return apiProvider.call<Exercise>({
      url: `exercises/${id}/unpublish`,
      method: 'PATCH',
    });
  },

  async archiveExercise(id: string): Promise<Exercise> {
    return apiProvider.call<Exercise>({
      url: `exercises/${id}/archive`,
      method: 'PATCH',
    });
  },

  async deleteExercise(id: string): Promise<void> {
    return apiProvider.call<void>({
      url: `exercises/${id}`,
      method: 'DELETE',
    });
  },
};

export default exerciseProvider;
