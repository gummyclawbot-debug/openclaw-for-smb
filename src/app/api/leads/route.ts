import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = req.nextUrl;
  const status = url.searchParams.get('status');
  const priority = url.searchParams.get('priority');
  const industry = url.searchParams.get('industry');
  const search = url.searchParams.get('search');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  let query = supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (priority) query = query.eq('priority', priority);
  if (industry) query = query.eq('industry', industry);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);
  if (search) query = query.or(`business_name.ilike.%${search}%,email.ilike.%${search}%,contact_name.ilike.%${search}%,phone.ilike.%${search}%,industry.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('leads').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('activity_log').insert({
    lead_id: data.id,
    action: 'Lead Created',
    details: `Lead manually created by admin`,
  });

  return NextResponse.json(data);
}
