import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = req.nextUrl;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const status = url.searchParams.get('status');

  let query = supabaseAdmin
    .from('consultations')
    .select('*, leads(*)')
    .order('scheduled_at', { ascending: true });

  if (from) query = query.gte('scheduled_at', from);
  if (to) query = query.lte('scheduled_at', to);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('consultations').insert(body).select('*, leads(*)').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update lead status
  await supabaseAdmin.from('leads').update({ status: 'Consultation Scheduled', updated_at: new Date().toISOString() }).eq('id', body.lead_id);
  await supabaseAdmin.from('activity_log').insert({
    lead_id: body.lead_id,
    action: 'Consultation Booked',
    details: `Scheduled for ${new Date(body.scheduled_at).toLocaleString()}`,
  });

  return NextResponse.json(data);
}
