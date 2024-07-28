import { User as AuthUser, Session as NextAuthSession } from "next-auth";

export interface RegisterParams {
  fullname: string;
  email: string;
  password: string;
}
export interface TaskParams {
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
}

export interface CustomUser extends AuthUser {
  email: string;
}

export interface CustomToken extends Record<string, any> {
  user?: CustomUser;
}

export interface UserSession extends NextAuthSession {
  user: {
    _id?: string;
    fullname?: string;
    email: string;
    role?: string;
  };
}

export interface TaskProps {
  task: {
    title: string;
    status: string;
    priority: string;
    deadline: string;
    description: string;
  };
}

// task board
export interface TasksValues {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  datetime: string;
}

export interface ColumnProps {
  title: string;
  headingColor: string;
  cards: TasksValues[];
  status: string;
  setCards: React.Dispatch<React.SetStateAction<TasksValues[]>>;
}

export interface CardProps {
  _id: string;
  title: string;
  status: string;
  description: string;
  priority: string;
  deadline: string;
  datetime: string;
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    card: TasksValues
  ) => void;
}

export interface DropIndicatorProps {
  beforeId: string | null;
  status: string;
}

export interface DeleteTaskProps {
  setCards: React.Dispatch<React.SetStateAction<TasksValues[]>>;
}
