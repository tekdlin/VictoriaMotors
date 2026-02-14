import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import {
  getDocumentsByCustomerId,
  createDocument,
} from '@/server/services/document.service';

export async function GET() {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const customer = await getCustomerByUserId(user.id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  const documents = await getDocumentsByCustomerId(customer.id);
  return NextResponse.json({ documents });
}

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
    const body = await request.json();
    const { document_type, file_name, file_path, file_size, mime_type } = body;

    if (!document_type || !file_name || !file_path || file_size == null || !mime_type) {
      return NextResponse.json(
        { error: 'Missing required document fields' },
        { status: 400 }
      );
    }

    const { data: document, error: createError } = await createDocument({
      customer_id: customer.id,
      document_type,
      file_name,
      file_path,
      file_size: Number(file_size),
      mime_type,
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({ document });
  } catch (err) {
    console.error('Create document error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
