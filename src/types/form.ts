/**
 * FormPulse Domain TypeScript Type Definitions
 * Complete typing for interactive forms, input fields, conversational widgets, and analytics
 */

export type QuestionType = "text" | "email" | "multiple_choice" | "yes_no";

// Question model with typed fields for all input types
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

// Specific question subtypes for strong typing
export interface TextQuestion extends Question {
  type: "text";
}

export interface EmailQuestion extends Question {
  type: "email";
}

export interface MultipleChoiceQuestion extends Question {
  type: "multiple_choice";
  options: string[];
}

export interface YesNoQuestion extends Question {
  type: "yes_no";
}

// Input values submitted for form fields
export type SingleAnswerValue = string | boolean | string[];
export type FormAnswersMap = Record<string, SingleAnswerValue>;

// Form Theme & Persona Customization
export interface FormTheme {
  primaryColor: string; // Hex color code (e.g. #4f46e5)
  backgroundColor?: string;
  botName: string;
  botAvatar: string; // Emoji or avatar icon
  welcomeMessage: string;
  completionMessage: string;
}

// Complete Form Entity
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

// Form Submission Entity
export interface FormSubmissionMetadata {
  ip?: string;
  userAgent?: string;
  completedAt?: string;
  durationSeconds?: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  answers: FormAnswersMap;
  metadata?: FormSubmissionMetadata;
  createdAt: string;
}

// Dashboard Analytics & KPI Statistics
export interface FormStats {
  totalForms: number;
  publishedForms: number;
  totalSubmissions: number;
  averageCompletionRate: number;
}

// Form Field Validation Result & Errors
export interface FormFieldError {
  questionId: string;
  message: string;
}

export type FormValidationErrors = Record<string, string>;

// Form Creation & Update Payloads
export interface CreateFormPayload {
  title: string;
  description?: string;
  slug?: string;
  theme?: Partial<FormTheme>;
  questions?: Question[];
  isPublished?: boolean;
}

export interface UpdateFormPayload {
  title?: string;
  description?: string;
  slug?: string;
  theme?: Partial<FormTheme>;
  questions?: Question[];
  isPublished?: boolean;
}

export interface SubmitResponsePayload {
  answers: FormAnswersMap;
  metadata?: FormSubmissionMetadata;
}

// Builder UI Types
export type BuilderTab = "questions" | "theme" | "settings";
export type BuilderMobileTab = "editor" | "preview";

export interface ColorPreset {
  name: string;
  hex: string;
}
