import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [leads, newLeads, consultations, wonLeads] = await Promise.all([
    supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabaseAdmin.from('consultations').select('*, leads(business_name, email)').eq('status', 'Scheduled').gte('scheduled_at', now.toISOString()).order('scheduled_at', { ascending: true }).limit(5),
    supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'Won'),
  ]);

  const totalLeads = leads.count || 0;
  const conversionRate = totalLeads > 0 ? ((wonLeads.count || 0) / totalLeads * 100).toFixed(1) : '0';

  return NextResponse.json({
    totalLeads,
    newThisWeek: newLeads.count || 0,
    upcomingConsultations: consultations.data || [],
    conversionRate: parseFloat(conversionRate),
  });
}
