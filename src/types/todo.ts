export type Priority = 'low' | 'medium' | 'high';
export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'finance';

export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    category: Category;
    dueDate?: string;
    createdAt: number;
    description?: string;
    tags?: string[];
    subtasks?: Subtask[];
}

export type FilterType = 'all' | 'active' | 'completed';
