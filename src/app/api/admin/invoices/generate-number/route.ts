/**
 * Generate next invoice number: HMM/{year}/{seq}
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const yearParam = request.nextUrl.searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
    const prefix = `HMM/${year}/`;

    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('invoice_number')
      .like('invoice_number', `${prefix}%`)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNum = lastInvoice?.[0]?.invoice_number;
    let invoice_number: string;
    if (!lastNum) {
      invoice_number = `${prefix}0001`;
    } else {
      const lastSeq = parseInt(lastNum.split('/').pop() || '0', 10);
      invoice_number = `${prefix}${String(lastSeq + 1).padStart(4, '0')}`;
    }

    return NextResponse.json({ success: true, invoice_number });
  } catch (error: unknown) {
    console.error('Error generating invoice number:', error);
    const year = new Date().getFullYear();
    return NextResponse.json({
      success: true,
      invoice_number: `HMM/${year}/0001`,
    });
  }
}
