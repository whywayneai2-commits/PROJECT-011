import { Todo } from '@/types/todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <div className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />

            <div className={styles.content}>
                <span className={styles.text}>{todo.text}</span>
                <div className={styles.meta}>
                    <span className={`${styles.badge} ${styles[`priority-${todo.priority}`]}`}>
                        {todo.priority}
                    </span>
                    <span className={styles.category}>{todo.category}</span>
                    {todo.dueDate && (
                        <span>📅 {new Date(todo.dueDate).toLocaleDateString()}</span>
                    )}
                </div>
            </div>

            <button
                className={styles.deleteBtn}
                onClick={() => onDelete(todo.id)}
                aria-label="Delete task"
            >
                🗑️
            </button>
        </div>
    );
}
