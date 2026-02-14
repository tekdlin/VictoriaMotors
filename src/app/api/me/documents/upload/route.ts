import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { createDocument } from '@/server/services/document.service';
import { createServerSupabaseClient } from '@/server/db/supabase';

const ALLOWED_DOCUMENT_TYPES = [
  'drivers_license_front',
  'drivers_license_back',
  'business_registration',
] as const;

export async function POST(request: NextRequest) {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const customer = await getCustomerByUserId(user.id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawType = formData.get('document_type') as string | null;

    if (!file || !rawType) {
      return NextResponse.json(
        { error: 'file and document_type are required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(rawType as (typeof ALLOWED_DOCUMENT_TYPES)[number])) {
      return NextResponse.json(
        { error: 'Invalid document_type' },
        { status: 400 }
      );
    }

    const documentType = rawType as (typeof ALLOWED_DOCUMENT_TYPES)[number];
    const fileExt = file.name.split('.').pop() ?? 'bin';
    const filePath = `${customer.id}/${documentType}.${fileExt}`;

    const supabase = await createServerSupabaseClient();
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, await file.arrayBuffer(), {
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const { data: document, error: createError } = await createDocument({
      customer_id: customer.id,
      document_type: documentType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type || 'application/octet-stream',
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({ document });
  } catch (err) {
    console.error('Document upload error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
