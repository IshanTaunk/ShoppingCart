import { getProducts } from '@/app/actions/fetchProducts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to test product search used by the chat tools.
 *
 * GET  /api/chat/debug?query=perfume&category=beauty&limit=5
 * POST /api/chat/debug  { "query": "perfume", "category": "beauty", "limit": 5 }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return runDebug({
    query: searchParams.get('query') || 'perfume',
    category: searchParams.get('category') || undefined,
    limit: Number(searchParams.get('limit') || 5),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return runDebug({
    query: typeof body.query === 'string' ? body.query : 'perfume',
    category:
      typeof body.category === 'string' ? body.category : undefined,
    limit:
      typeof body.limit === 'number' && Number.isFinite(body.limit)
        ? body.limit
        : 5,
  });
}

async function runDebug(params: {
  query: string;
  category?: string;
  limit: number;
}) {
  const startedAt = Date.now();
  try {
    const products = await getProducts({
      query: params.query,
      category: params.category,
      limit: params.limit,
    });

    return NextResponse.json({
      ok: true,
      ms: Date.now() - startedAt,
      params,
      count: products?.length ?? 0,
      products: (products || []).map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        price: p.price,
        brand: p.brand,
      })),
    });
  } catch (error) {
    console.error('[chat-debug] getProducts failed:', error);
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - startedAt,
        params,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      },
      { status: 500 },
    );
  }
}
