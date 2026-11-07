import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { addSharedFile, CustomerProjectServiceError } from "@/services/customerProjectService";
import { uploadFileToStorage } from "@/services/storageService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/projects/[id]/files
 * Admin uploads shared files (design mockups, documentation, preview builds) for customer.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const adminSession = verifyAdminRequest(request);
  if (!adminSession) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const category = (formData.get("category") as string) || "Design Mockups";

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided in form data." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const storagePath = `projects/${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      let url = "";
      let resolvedStoragePath = storagePath;
      try {
        const uploadResult = await uploadFileToStorage(
          buffer,
          file.name,
          file.type || "application/octet-stream",
          { folder: `projects/${id}` }
        );
        url = uploadResult.downloadUrl;
        resolvedStoragePath = uploadResult.path;
      } catch {
        // Fallback simulated URL in local dev without Firebase Storage keys
        url = `/api/storage/download?path=${encodeURIComponent(storagePath)}`;
      }

      const updatedProject = await addSharedFile(id, {
        name: file.name,
        originalName: file.name,
        size: file.size,
        contentType: file.type || "application/octet-stream",
        url,
        storagePath: resolvedStoragePath,
        category: category as "Design Mockups" | "Preview Builds" | "Documentation" | "Source / Assets",
        uploadedBy: adminSession.email,
      });

      return NextResponse.json(
        {
          success: true,
          message: `File "${file.name}" uploaded successfully.`,
          data: updatedProject,
        },
        { status: 201 }
      );
    }

    // JSON payload attachment (e.g. external link / preview link)
    const body = await request.json();
    const { name, url, category, size, contentType: fileType } = body || {};

    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: "File name and URL are required." },
        { status: 400 }
      );
    }

    const updatedProject = await addSharedFile(id, {
      name,
      originalName: name,
      size: Number(size) || 1024,
      contentType: fileType || "application/octet-stream",
      url,
      category: category || "Design Mockups",
      uploadedBy: adminSession.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: `File "${name}" attached successfully.`,
        data: updatedProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`Failed to upload file for project ${id}:`, error);
    if (error instanceof CustomerProjectServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
