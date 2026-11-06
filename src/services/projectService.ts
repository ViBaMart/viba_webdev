import { FEATURED_PROJECTS } from "@/config/agency";
import { getAdminFirebase } from "@/lib/firebase/admin";
import { ProjectCaseStudy } from "@/types/project";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const PROJECTS_COLLECTION = "projects";

/**
 * Service for querying portfolio projects and case studies.
 * Provides fallback to vetted agency case studies when database entries are empty.
 */
export async function getProjects(): Promise<ProjectCaseStudy[]> {
  const { db, configured } = getAdminFirebase();

  if (!configured || !db) {
    // Return curated agency showcase projects
    return FEATURED_PROJECTS;
  }

  try {
    const snapshot = await db.collection(PROJECTS_COLLECTION).get();
    if (snapshot.empty) {
      return FEATURED_PROJECTS;
    }

    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as Omit<ProjectCaseStudy, "id">),
    }));
  } catch {
    return FEATURED_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectCaseStudy | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}
