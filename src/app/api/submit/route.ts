import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Create lead in Supabase
    const { error } = await supabaseAdmin.from('leads').insert({
      business_name: data.businessName || 'Unknown',
      industry: data.industry || null,
      contact_name: data.contactName || null,
      email: data.email || null,
      phone: data.phone || null,
      current_tools: data.currentTools || null,
      time_waster: data.timeWaster || null,
      status: 'New',
      priority: 'Medium',
    });

    if (error) console.error('Supabase insert error:', error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
