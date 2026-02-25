import { NextRequest, NextResponse } from "next/server";
import { writeFile, appendFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const entry = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    const logPath = join(process.cwd(), "submissions.jsonl");
    await appendFile(logPath, JSON.stringify(entry) + "\n");

    console.log("New submission:", entry);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
