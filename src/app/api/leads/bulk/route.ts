import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, ids } = await req.json();

  if (action === 'delete') {
    const { error } = await supabaseAdmin.from('leads').delete().in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === 'mark_contacted') {
    const { error } = await supabaseAdmin
      .from('leads')
      .update({ status: 'Contacted', updated_at: new Date().toISOString() })
      .in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
