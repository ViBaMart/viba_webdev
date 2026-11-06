import { NextResponse } from "next/server";
import { getProjects } from "@/services/projectService";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(
    {
      success: true,
      data: projects,
      total: projects.length,
    },
    { status: 200 }
  );
}
