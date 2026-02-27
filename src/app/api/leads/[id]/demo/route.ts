import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';
import { execSync } from 'child_process';
import path from 'path';

// TODO: Phase 2 — Deploy generated HTML to Vercel via branch commit + Vercel API
// For now, serves HTML locally and generates screenshots via Python + Playwright

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Fetch lead data
  const { data: lead, error: fetchError } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  try {
    const generatorPath = path.resolve(process.cwd(), 'demo-generator', 'generator.py');

    // Pass lead data via stdin to Python generator
    const input = JSON.stringify({
      id: lead.id,
      business_name: lead.business_name,
      industry: lead.industry,
      time_waster: lead.time_waster,
      // Privacy: only pass business-relevant fields, not personal contact info
    });

    const output = execSync(`echo '${input.replace(/'/g, "'\\''")}' | python3 "${generatorPath}"`, {
      encoding: 'utf-8',
      timeout: 30000,
    });

    const result = JSON.parse(output.trim());

    if (result.status === 'error') {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Build URLs for the client
    const htmlUrl = `/api/leads/${id}/demo/site`;
    const screenshotUrl = result.screenshot_ok ? `/api/leads/${id}/demo/screenshot` : null;

    // Update lead record with demo URLs
    await supabaseAdmin
      .from('leads')
      .update({
        demo_url: result.html_path,
        demo_screenshot: result.screenshot_path,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      lead_id: id,
      action: 'Demo Generated',
      details: `Theme: ${result.theme} | Screenshot: ${result.screenshot_ok ? 'Yes' : 'No'}`,
    });

    return NextResponse.json({
      status: 'success',
      html_url: htmlUrl,
      screenshot_url: screenshotUrl,
      theme: result.theme,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Demo generation failed:', message);
    return NextResponse.json({ error: 'Demo generation failed', details: message }, { status: 500 });
  }
}

// Serve the generated HTML file
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const url = req.nextUrl;
  const type = url.searchParams.get('type') || 'site';

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('demo_url, demo_screenshot')
    .eq('id', id)
    .single();

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const fs = await import('fs');
  const filePath = type === 'screenshot' ? lead.demo_screenshot : lead.demo_url;

  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Demo not generated yet' }, { status: 404 });
  }

  const content = fs.readFileSync(filePath);
  const contentType = type === 'screenshot' ? 'image/png' : 'text/html';

  return new NextResponse(content, {
    headers: { 'Content-Type': contentType },
  });
}
