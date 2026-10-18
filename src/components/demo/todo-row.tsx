import { CheckCircle2, Circle } from "lucide-react";

import type { Todo } from "@/features/todos/types";
import { cn } from "@/lib/utils";

type TodoRowProps = {
  todo: Pick<Todo, "title" | "completed">;
  className?: string;
  onToggle?: () => void;
  children?: React.ReactNode;
};

const TodoRow = ({ todo, className, onToggle, children }: TodoRowProps) => (
  <li
    className={cn(
      "bg-background flex items-center gap-3 rounded-md border px-3 py-2 text-sm",
      className
    )}
  >
    <button
      type="button"
      onClick={onToggle}
      disabled={!onToggle}
      className="text-muted-foreground hover:text-foreground disabled:cursor-default"
      aria-label={todo.completed ? "Mark as not done" : "Mark as done"}
    >
      {todo.completed ? (
        <CheckCircle2 className="size-5 text-emerald-600" />
      ) : (
        <Circle className="size-5" />
      )}
    </button>
    <span
      className={cn(
        "flex-1 truncate",
        todo.completed && "text-muted-foreground line-through"
      )}
    >
      {todo.title}
    </span>
    {children}
  </li>
);

export default TodoRow;
