import { getAdminFirebase } from "@/lib/firebase/admin";
import crypto from "crypto";
import {
  CustomerProjectRecord,
  CreateCustomerProjectDTO,
  ProjectStage,
  PROJECT_STAGES_LIST,
  ProjectProgressNote,
  ProjectSharedFile,
  CustomerFeedbackItem,
} from "@/types/customerProject";
import { updateApplicationStatus } from "@/services/applicationService";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const CUSTOMER_PROJECTS_COLLECTION = "customer_projects";

// In-memory fallback for local development or when Firebase credentials are not provisioned
const memoryCustomerProjects = new Map<string, CustomerProjectRecord>();

export class CustomerProjectServiceError extends Error {
  code: "VALIDATION_FAILED" | "NOT_FOUND" | "UNAUTHORIZED" | "DATABASE_ERROR";

  constructor(message: string, code: "VALIDATION_FAILED" | "NOT_FOUND" | "UNAUTHORIZED" | "DATABASE_ERROR") {
    super(message);
    this.name = "CustomerProjectServiceError";
    this.code = code;
  }
}

export function generateProjectId(): string {
  const currentYear = 2026;
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-PRJ-${currentYear}-${suffix}`;
}

export function generateAccessToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function calculateStageProgress(stage: ProjectStage): number {
  switch (stage) {
    case "Requirement Analysis":
      return 16;
    case "Design":
      return 33;
    case "Development":
      return 50;
    case "Testing":
      return 66;
    case "Customer Review":
      return 83;
    case "Final Delivery":
      return 100;
    default:
      return 16;
  }
}

/**
 * Creates and initializes a new customer project in Firestore.
 */
export async function createCustomerProject(
  dto: CreateCustomerProjectDTO,
  adminEmail: string
): Promise<CustomerProjectRecord> {
  if (!dto.projectName || dto.projectName.trim().length < 2) {
    throw new CustomerProjectServiceError("Project name is required.", "VALIDATION_FAILED");
  }
  if (!dto.clientName || !dto.clientEmail) {
    throw new CustomerProjectServiceError("Client name and email are required.", "VALIDATION_FAILED");
  }

  const projectId = generateProjectId();
  const accessToken = generateAccessToken();
  const now = new Date().toISOString();
  const today = now.split("T")[0];
  const targetDate =
    dto.expectedDeliveryDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const initialNote: ProjectProgressNote = {
    id: `note-${Date.now()}`,
    stage: "Requirement Analysis",
    title: "Project Initialized & Requirement Analysis Commenced",
    content:
      dto.initialNotes?.trim() ||
      "Quotation approved and advance payment reconciled. ViBa engineering team has begun formal requirement analysis and architecture planning.",
    authorEmail: adminEmail,
    createdAt: now,
  };

  const project: CustomerProjectRecord = {
    id: projectId,
    accessToken,
    applicationId: dto.applicationId,
    quotationId: dto.quotationId,
    paymentId: dto.paymentId,
    projectName: dto.projectName.trim(),
    clientName: dto.clientName.trim(),
    clientBusiness: dto.clientBusiness.trim(),
    clientEmail: dto.clientEmail.trim().toLowerCase(),
    clientMobile: dto.clientMobile.trim(),
    websiteType: dto.websiteType || "Dynamic Business Website",
    currentStage: "Requirement Analysis",
    stageProgressPercent: calculateStageProgress("Requirement Analysis"),
    startDate: today,
    expectedDeliveryDate: targetDate,
    isDeliveryApproved: false,
    stagingUrl: dto.stagingUrl?.trim() || "",
    repositoryUrl: dto.repositoryUrl?.trim() || "",
    assignedLead: dto.assignedLead?.trim() || "ViBa Lead Engineer",
    progressNotes: [initialNote],
    sharedFiles: [],
    customerFeedback: [],
    createdAt: now,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(projectId).set(project);
    } catch (err) {
      console.warn("Firestore customer project write failed, falling back to memory:", err);
      memoryCustomerProjects.set(projectId, project);
    }
  } else {
    memoryCustomerProjects.set(projectId, project);
  }

  // Update associated application status to "Project Started"
  if (dto.applicationId) {
    try {
      await updateApplicationStatus(dto.applicationId, "Project Started");
    } catch {
      // Ignored
    }
  }

  return project;
}

/**
 * Retrieves a customer project by ID.
 */
export async function getCustomerProjectById(id: string): Promise<CustomerProjectRecord | null> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const doc = await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...(doc.data() as Omit<CustomerProjectRecord, "id">),
        };
      }
    } catch (err) {
      console.error("Failed to query customer project from Firestore:", err);
    }
  }

  return memoryCustomerProjects.get(id) || null;
}

/**
 * Lists all customer projects (Admin only).
 */
export async function listCustomerProjects(): Promise<CustomerProjectRecord[]> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const snapshot = await db
        .collection(CUSTOMER_PROJECTS_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<CustomerProjectRecord, "id">),
        }));
      }
    } catch (err) {
      console.error("Failed to query customer projects from Firestore:", err);
    }
  }

  return Array.from(memoryCustomerProjects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Admin Action: Updates project stage and recalculates progress.
 */
export async function updateProjectStage(
  id: string,
  newStage: ProjectStage,
  adminEmail: string,
  stageNote?: string
): Promise<CustomerProjectRecord> {
  if (!PROJECT_STAGES_LIST.includes(newStage)) {
    throw new CustomerProjectServiceError(
      `Invalid stage. Must be one of: ${PROJECT_STAGES_LIST.join(", ")}`,
      "VALIDATION_FAILED"
    );
  }

  const project = await getCustomerProjectById(id);
  if (!project) {
    throw new CustomerProjectServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const progressPercent = calculateStageProgress(newStage);

  const transitionNote: ProjectProgressNote = {
    id: `note-${Date.now()}`,
    stage: newStage,
    title: `Project Advanced to Stage: ${newStage}`,
    content:
      stageNote?.trim() ||
      `Project stage has successfully progressed from "${project.currentStage}" to "${newStage}". All milestone checkpoints for this phase are active.`,
    authorEmail: adminEmail,
    createdAt: now,
  };

  const updated: CustomerProjectRecord = {
    ...project,
    currentStage: newStage,
    stageProgressPercent: progressPercent,
    progressNotes: [transitionNote, ...project.progressNotes],
    updatedAt: now,
    ...(newStage === "Final Delivery" ? { actualDeliveryDate: now.split("T")[0] } : {}),
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).update({
        currentStage: newStage,
        stageProgressPercent: progressPercent,
        progressNotes: updated.progressNotes,
        updatedAt: now,
        ...(newStage === "Final Delivery" ? { actualDeliveryDate: now.split("T")[0] } : {}),
      });
    } catch (err) {
      console.warn("Firestore project stage update failed, falling back to memory:", err);
      memoryCustomerProjects.set(id, updated);
    }
  } else {
    memoryCustomerProjects.set(id, updated);
  }

  return updated;
}

/**
 * Admin Action: Adds a progress update note.
 */
export async function addProgressNote(
  id: string,
  note: { stage?: ProjectStage; title: string; content: string },
  adminEmail: string
): Promise<CustomerProjectRecord> {
  if (!note.title || !note.content) {
    throw new CustomerProjectServiceError("Note title and content are required.", "VALIDATION_FAILED");
  }

  const project = await getCustomerProjectById(id);
  if (!project) {
    throw new CustomerProjectServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const newNote: ProjectProgressNote = {
    id: `note-${Date.now()}`,
    stage: note.stage || project.currentStage,
    title: note.title.trim(),
    content: note.content.trim(),
    authorEmail: adminEmail,
    createdAt: now,
  };

  const updated: CustomerProjectRecord = {
    ...project,
    progressNotes: [newNote, ...project.progressNotes],
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).update({
        progressNotes: updated.progressNotes,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore add progress note failed, falling back to memory:", err);
      memoryCustomerProjects.set(id, updated);
    }
  } else {
    memoryCustomerProjects.set(id, updated);
  }

  return updated;
}

/**
 * Admin Action: Adds a shared file (design mockup, documentation, preview asset).
 */
export async function addSharedFile(
  id: string,
  file: Omit<ProjectSharedFile, "id" | "uploadedAt">
): Promise<CustomerProjectRecord> {
  const project = await getCustomerProjectById(id);
  if (!project) {
    throw new CustomerProjectServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const newFile: ProjectSharedFile = {
    ...file,
    id: `file-${Date.now()}`,
    uploadedAt: now,
  };

  const updated: CustomerProjectRecord = {
    ...project,
    sharedFiles: [newFile, ...project.sharedFiles],
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).update({
        sharedFiles: updated.sharedFiles,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore add shared file failed, falling back to memory:", err);
      memoryCustomerProjects.set(id, updated);
    }
  } else {
    memoryCustomerProjects.set(id, updated);
  }

  return updated;
}

/**
 * Admin Action: Updates expected delivery date and environments.
 */
export async function updateProjectSettings(
  id: string,
  updates: {
    expectedDeliveryDate?: string;
    stagingUrl?: string;
    liveUrl?: string;
    repositoryUrl?: string;
    assignedLead?: string;
  }
): Promise<CustomerProjectRecord> {
  const project = await getCustomerProjectById(id);
  if (!project) {
    throw new CustomerProjectServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updated: CustomerProjectRecord = {
    ...project,
    ...updates,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).update({
        ...updates,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore update settings failed, falling back to memory:", err);
      memoryCustomerProjects.set(id, updated);
    }
  } else {
    memoryCustomerProjects.set(id, updated);
  }

  return updated;
}

/**
 * Customer Action: Submits feedback for current or previous project stages.
 */
export async function submitCustomerFeedback(
  id: string,
  feedback: { message: string; stage?: ProjectStage },
  customerName: string,
  customerEmail: string
): Promise<CustomerProjectRecord> {
  if (!feedback.message || feedback.message.trim().length < 2) {
    throw new CustomerProjectServiceError("Feedback message is required.", "VALIDATION_FAILED");
  }

  const project = await getCustomerProjectById(id);
  if (!project) {
    throw new CustomerProjectServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const feedbackItem: CustomerFeedbackItem = {
    id: `fb-${Date.now()}`,
    customerName,
    customerEmail,
    stage: feedback.stage || project.currentStage,
    message: feedback.message.trim(),
    submittedAt: now,
  };

  const updated: CustomerProjectRecord = {
    ...project,
    customerFeedback: [feedbackItem, ...project.customerFeedback],
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).update({
        customerFeedback: updated.customerFeedback,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore customer feedback write failed, falling back to memory:", err);
      memoryCustomerProjects.set(id, updated);
    }
  } else {
    memoryCustomerProjects.set(id, updated);
  }

  return updated;
}

/**
 * Customer Action: Approves final delivery signoff.
 */
export async function approveFinalDelivery(
  id: string,
  notes?: string
): Promise<CustomerProjectRecord> {
  const project = await getCustomerProjectById(id);
  if (!project) {
    throw new CustomerProjectServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const finalNote: ProjectProgressNote = {
    id: `note-${Date.now()}`,
    stage: "Final Delivery",
    title: "Final Delivery Formally Approved by Client",
    content: notes || "Client has reviewed deliverables and provided final approval signoff.",
    authorEmail: project.clientEmail,
    createdAt: now,
  };

  const updated: CustomerProjectRecord = {
    ...project,
    isDeliveryApproved: true,
    deliveryApprovedAt: now,
    deliveryApprovalNotes: notes || "Client confirmed full satisfaction with project deliverables.",
    currentStage: "Final Delivery",
    stageProgressPercent: 100,
    progressNotes: [finalNote, ...project.progressNotes],
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(CUSTOMER_PROJECTS_COLLECTION).doc(id).update({
        isDeliveryApproved: true,
        deliveryApprovedAt: now,
        deliveryApprovalNotes: updated.deliveryApprovalNotes,
        currentStage: "Final Delivery",
        stageProgressPercent: 100,
        progressNotes: updated.progressNotes,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore approve delivery write failed, falling back to memory:", err);
      memoryCustomerProjects.set(id, updated);
    }
  } else {
    memoryCustomerProjects.set(id, updated);
  }

  if (project.applicationId) {
    try {
      await updateApplicationStatus(project.applicationId, "Completed");
    } catch {
      // Ignored
    }
  }

  return updated;
}

/**
 * Restricts customer to their own project by verifying token or client email.
 */
export function verifyCustomerAccess(
  project: CustomerProjectRecord,
  token?: string | null,
  email?: string | null
): boolean {
  if (token && token.trim() === project.accessToken) {
    return true;
  }
  if (email && email.trim().toLowerCase() === project.clientEmail.toLowerCase()) {
    return true;
  }
  return false;
}

