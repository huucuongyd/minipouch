import { pingDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pingDatabase();
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    return Response.json({ ok: false, error: message }, { status: 503 });
  }
}
