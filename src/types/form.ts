export type QuestionType = "text" | "email" | "multiple_choice" | "yes_no";

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: string[]; // for multiple_choice questions
  order: number;
}

export interface FormTheme {
  primaryColor: string; // e.g. #6366f1
  backgroundColor?: string;
  botName: string;
  botAvatar: string;
  welcomeMessage: string;
  completionMessage: string;
}

export interface Form {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  theme: FormTheme;
  questions: Question[];
  submissionCount?: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  answers: Record<string, string | boolean | string[]>;
  metadata?: {
    ip?: string;
    userAgent?: string;
    completedAt?: string;
    durationSeconds?: number;
  };
  createdAt: string;
}

export interface FormStats {
  totalForms: number;
  publishedForms: number;
  totalSubmissions: number;
  averageCompletionRate: number;
}
