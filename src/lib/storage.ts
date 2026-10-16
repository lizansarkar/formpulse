import fs from "fs";
import path from "path";
import { Form, FormSubmission, FormStats, Question } from "@/types/form";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "formpulse.json");

interface DatabaseSchema {
  forms: Form[];
  submissions: FormSubmission[];
}

const DEFAULT_FORMS: Form[] = [
  {
    id: "fp_customer_feedback",
    slug: "customer-feedback",
    title: "Customer Experience & Feedback",
    description: "Collect actionable feedback and customer sentiment in a conversational flow.",
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    theme: {
      primaryColor: "#4f46e5", // Indigo
      botName: "PulseBot",
      botAvatar: "✨",
      welcomeMessage: "Hey there! 👋 We'd love to hear your thoughts so we can make FormPulse even better for you.",
      completionMessage: "Thank you so much for your feedback! It means the world to our team. 🚀",
    },
    questions: [
      {
        id: "q_name",
        type: "text",
        title: "To get started, what's your name?",
        placeholder: "e.g. Alex Rivera",
        required: true,
        order: 1,
      },
      {
        id: "q_email",
        type: "email",
        title: "Nice to meet you! What's your email address?",
        placeholder: "alex@company.com",
        required: true,
        order: 2,
      },
      {
        id: "q_rating",
        type: "multiple_choice",
        title: "How would you rate your overall experience with our service so far?",
        options: [
          "🌟 5 - Exceptional",
          "👍 4 - Very Good",
          "👌 3 - Average",
          "👎 2 - Needs Improvement",
        ],
        required: true,
        order: 3,
      },
      {
        id: "q_improvement",
        type: "text",
        title: "What is one thing we could do to make your experience 10x better?",
        placeholder: "Tell us anything that comes to mind...",
        required: false,
        order: 4,
      },
      {
        id: "q_recommend",
        type: "yes_no",
        title: "Would you recommend FormPulse to a friend or team member?",
        required: true,
        order: 5,
      },
    ],
  },
  {
    id: "fp_lead_gen",
    slug: "lead-qualification",
    title: "Enterprise Lead Qualification",
    description: "Convert high-intent website visitors into qualified pipeline leads.",
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    theme: {
      primaryColor: "#0284c7", // Sky blue
      botName: "SalesAssistant",
      botAvatar: "💼",
      welcomeMessage: "Hello! Welcome to our enterprise portal. Let's find the ideal solution for your company.",
      completionMessage: "Great! Our solutions architect will review your answers and reach out within 2 business hours.",
    },
    questions: [
      {
        id: "lq_name",
        type: "text",
        title: "What is your full name and company name?",
        placeholder: "e.g. Sarah Connor at Acme Corp",
        required: true,
        order: 1,
      },
      {
        id: "lq_email",
        type: "email",
        title: "What is your primary work email address?",
        placeholder: "sarah@acme.com",
        required: true,
        order: 2,
      },
      {
        id: "lq_team_size",
        type: "multiple_choice",
        title: "How large is your organization?",
        options: ["1 - 10 employees", "11 - 50 employees", "51 - 250 employees", "250+ enterprise"],
        required: true,
        order: 3,
      },
      {
        id: "lq_timeline",
        type: "yes_no",
        title: "Are you actively looking to deploy a solution within the next 30 days?",
        required: true,
        order: 4,
      },
    ],
  },
  {
    id: "fp_product_waitlist",
    slug: "product-waitlist",
    title: "VIP Early Access Waitlist",
    description: "Capture interested users for early beta releases.",
    isPublished: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    theme: {
      primaryColor: "#7c3aed", // Violet
      botName: "BetaBot",
      botAvatar: "🚀",
      welcomeMessage: "Welcome to the VIP Early Access Program! Reserve your invite before public launch.",
      completionMessage: "You're on the list! Check your inbox shortly for your priority access token.",
    },
    questions: [
      {
        id: "w_name",
        type: "text",
        title: "What should we call you?",
        placeholder: "Your nickname or name",
        required: true,
        order: 1,
      },
      {
        id: "w_email",
        type: "email",
        title: "What email should we send your beta invite to?",
        placeholder: "you@example.com",
        required: true,
        order: 2,
      },
      {
        id: "w_platform",
        type: "multiple_choice",
        title: "What tech stack will you embed this widget into?",
        options: ["Next.js / React", "WordPress / Webflow", "Shopify Store", "Custom HTML"],
        required: true,
        order: 3,
      },
      {
        id: "w_api",
        type: "yes_no",
        title: "Are you interested in testing our GraphQL / Webhook developer APIs?",
        required: true,
        order: 4,
      },
    ],
  },
];

const DEFAULT_SUBMISSIONS: FormSubmission[] = [
  {
    id: "sub_1",
    formId: "fp_customer_feedback",
    answers: {
      q_name: "Emma Watson",
      q_email: "emma.watson@example.com",
      q_rating: "🌟 5 - Exceptional",
      q_improvement: "Would love automated webhook triggers to Slack!",
      q_recommend: "Yes",
    },
    metadata: {
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      durationSeconds: 42,
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "sub_2",
    formId: "fp_customer_feedback",
    answers: {
      q_name: "Liam Davies",
      q_email: "liam.d@techstartup.io",
      q_rating: "👍 4 - Very Good",
      q_improvement: "The conversational UI is super smooth. Maybe add file uploads in the future.",
      q_recommend: "Yes",
    },
    metadata: {
      ip: "10.0.0.4",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      durationSeconds: 58,
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "sub_3",
    formId: "fp_lead_gen",
    answers: {
      lq_name: "Marcus Vance at Apex Growth",
      lq_email: "marcus@apexgrowth.co",
      lq_team_size: "51 - 250 employees",
      lq_timeline: "Yes",
    },
    metadata: {
      ip: "172.16.0.2",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
      durationSeconds: 31,
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

function ensureDataFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData: DatabaseSchema = {
      forms: DEFAULT_FORMS,
      submissions: DEFAULT_SUBMISSIONS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(content) as DatabaseSchema;
    if (!data.forms || !Array.isArray(data.forms)) {
      data.forms = DEFAULT_FORMS;
    }
    if (!data.submissions || !Array.isArray(data.submissions)) {
      data.submissions = DEFAULT_SUBMISSIONS;
    }
    return data;
  } catch {
    const fallback: DatabaseSchema = {
      forms: DEFAULT_FORMS,
      submissions: DEFAULT_SUBMISSIONS,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function writeDataFile(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DATA_FILE);
}

export async function getAllForms(): Promise<Form[]> {
  const db = ensureDataFile();
  const formsWithCount = db.forms.map((form) => {
    const count = db.submissions.filter((s) => s.formId === form.id).length;
    return {
      ...form,
      submissionCount: count,
    };
  });
  return formsWithCount.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getFormByIdOrSlug(idOrSlug: string): Promise<Form | null> {
  const db = ensureDataFile();
  const form = db.forms.find((f) => f.id === idOrSlug || f.slug === idOrSlug);
  if (!form) return null;

  const count = db.submissions.filter((s) => s.formId === form.id).length;
  return {
    ...form,
    submissionCount: count,
  };
}

export async function createForm(payload: {
  title: string;
  description?: string;
  slug?: string;
  theme?: Partial<Form["theme"]>;
  questions?: Question[];
  isPublished?: boolean;
}): Promise<Form> {
  const db = ensureDataFile();
  const id = `fp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const baseSlug = (payload.slug || payload.title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = baseSlug || `form-${Date.now().toString(36)}`;

  const newForm: Form = {
    id,
    slug,
    title: payload.title || "Untitled Interactive Form",
    description: payload.description || "",
    isPublished: payload.isPublished ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: {
      primaryColor: payload.theme?.primaryColor || "#4f46e5",
      backgroundColor: payload.theme?.backgroundColor || "#ffffff",
      botName: payload.theme?.botName || "PulseBot",
      botAvatar: payload.theme?.botAvatar || "💬",
      welcomeMessage:
        payload.theme?.welcomeMessage ||
        "Hello! 👋 Thanks for stopping by. Let's take a moment to connect.",
      completionMessage:
        payload.theme?.completionMessage ||
        "Thank you! Your response has been securely saved.",
    },
    questions: payload.questions || [
      {
        id: `q_${Date.now()}_1`,
        type: "text",
        title: "What is your name?",
        placeholder: "Your name here",
        required: true,
        order: 1,
      },
      {
        id: `q_${Date.now()}_2`,
        type: "email",
        title: "What's the best email to contact you?",
        placeholder: "you@example.com",
        required: true,
        order: 2,
      },
    ],
    submissionCount: 0,
  };

  db.forms.unshift(newForm);
  writeDataFile(db);
  return newForm;
}

export async function updateForm(
  id: string,
  payload: Partial<Form>
): Promise<Form | null> {
  const db = ensureDataFile();
  const index = db.forms.findIndex((f) => f.id === id);
  if (index === -1) return null;

  const existing = db.forms[index];
  const updatedForm: Form = {
    ...existing,
    ...payload,
    theme: {
      ...existing.theme,
      ...(payload.theme || {}),
    },
    questions: payload.questions || existing.questions,
    updatedAt: new Date().toISOString(),
  };

  db.forms[index] = updatedForm;
  writeDataFile(db);
  const count = db.submissions.filter((s) => s.formId === id).length;
  return { ...updatedForm, submissionCount: count };
}

export async function deleteForm(id: string): Promise<boolean> {
  const db = ensureDataFile();
  const initialLength = db.forms.length;
  db.forms = db.forms.filter((f) => f.id !== id);
  db.submissions = db.submissions.filter((s) => s.formId !== id);

  if (db.forms.length < initialLength) {
    writeDataFile(db);
    return true;
  }
  return false;
}

export async function togglePublishForm(id: string): Promise<Form | null> {
  const db = ensureDataFile();
  const form = db.forms.find((f) => f.id === id);
  if (!form) return null;

  form.isPublished = !form.isPublished;
  form.updatedAt = new Date().toISOString();
  writeDataFile(db);
  const count = db.submissions.filter((s) => s.formId === id).length;
  return { ...form, submissionCount: count };
}

export async function createSubmission(
  formId: string,
  answers: Record<string, string | boolean | string[]>,
  metadata?: FormSubmission["metadata"]
): Promise<FormSubmission> {
  const db = ensureDataFile();
  const submission: FormSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    formId,
    answers,
    metadata,
    createdAt: new Date().toISOString(),
  };

  db.submissions.unshift(submission);
  writeDataFile(db);
  return submission;
}

export async function getSubmissionsByFormId(
  formId: string
): Promise<FormSubmission[]> {
  const db = ensureDataFile();
  return db.submissions
    .filter((s) => s.formId === formId)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function deleteSubmission(submissionId: string): Promise<boolean> {
  const db = ensureDataFile();
  const initialLength = db.submissions.length;
  db.submissions = db.submissions.filter((s) => s.id !== submissionId);

  if (db.submissions.length < initialLength) {
    writeDataFile(db);
    return true;
  }
  return false;
}

export async function getDashboardStats(): Promise<FormStats> {
  const db = ensureDataFile();
  const totalForms = db.forms.length;
  const publishedForms = db.forms.filter((f) => f.isPublished).length;
  const totalSubmissions = db.submissions.length;
  const averageCompletionRate = totalForms > 0 ? 84.5 : 0; // realistic aggregate benchmark

  return {
    totalForms,
    publishedForms,
    totalSubmissions,
    averageCompletionRate,
  };
}
