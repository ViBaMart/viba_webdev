import { WebsiteType } from "@/types/application";

export type ProjectStage =
  | "Requirement Analysis"
  | "Design"
  | "Development"
  | "Testing"
  | "Customer Review"
  | "Final Delivery";

export const PROJECT_STAGES_LIST: ProjectStage[] = [
  "Requirement Analysis",
  "Design",
  "Development",
  "Testing",
  "Customer Review",
  "Final Delivery",
];

export interface ProjectProgressNote {
  id: string;
  stage: ProjectStage;
  title: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

export interface ProjectSharedFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  contentType: string;
  url: string;
  storagePath?: string;
  category: "Design Mockups" | "Preview Builds" | "Documentation" | "Source / Assets";
  uploadedBy: string;
  uploadedAt: string;
}

export interface CustomerFeedbackItem {
  id: string;
  customerName: string;
  customerEmail: string;
  stage: ProjectStage;
  message: string;
  submittedAt: string;
}

export interface CustomerProjectRecord {
  id: string; // e.g. VIBA-PRJ-2026-XXXXX
  userId?: string; // Authenticated Customer UID
  accessToken: string; // Secure token to restrict customer to their own project
  applicationId: string;
  quotationId: string;
  paymentId?: string;
  projectName: string;
  clientName: string;
  clientBusiness: string;
  clientEmail: string;
  clientMobile: string;
  websiteType: WebsiteType | string;

  // The 6 Official Project Stages
  currentStage: ProjectStage;
  stageProgressPercent: number; // 1: 16%, 2: 33%, 3: 50%, 4: 66%, 5: 83%, 6: 100%

  // Timeline
  startDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;

  // Final Delivery Signoff
  isDeliveryApproved: boolean;
  deliveryApprovedAt?: string;
  deliveryApprovalNotes?: string;

  // Environments
  stagingUrl?: string;
  liveUrl?: string;
  repositoryUrl?: string;
  assignedLead?: string;

  // Timeline history & deliverables
  progressNotes: ProjectProgressNote[];
  sharedFiles: ProjectSharedFile[];
  customerFeedback: CustomerFeedbackItem[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerProjectDTO {
  applicationId: string;
  quotationId: string;
  paymentId?: string;
  projectName: string;
  clientName: string;
  clientBusiness: string;
  clientEmail: string;
  clientMobile: string;
  websiteType: WebsiteType | string;
  expectedDeliveryDate: string;
  stagingUrl?: string;
  repositoryUrl?: string;
  assignedLead?: string;
  initialNotes?: string;
}

export interface AddProgressNoteDTO {
  stage?: ProjectStage;
  title: string;
  content: string;
}

export interface SubmitFeedbackDTO {
  stage?: ProjectStage;
  message: string;
}

export interface ApproveDeliveryDTO {
  approvalNotes?: string;
}

