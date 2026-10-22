import prisma from '@/libs/prismadb';
import { NextRequest, NextResponse } from 'next/server';

type AggregateCommandResult = {
  cursor?: {
    firstBatch?: unknown;
  };
};

type AutocompleteSuggestion = {
  _id?: string | number;
  id?: string | number;
  title?: string;
};

function normalizeSuggestions(
  rows: AutocompleteSuggestion[],
): { id: string; title: string }[] {
  return rows
    .map((row) => {
      const id = row._id ?? row.id;
      const title = row.title;
      if (id == null || !title) return null;
      return { id: String(id), title };
    })
    .filter((row): row is { id: string; title: string } => row !== null);
}

async function atlasAutocomplete(query: string) {
  const res = await prisma.$runCommandRaw({
    aggregate: 'Product',
    pipeline: [
      {
        $search: {
          index: 'default',
          autocomplete: {
            query,
            path: 'title',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 2,
            },
          },
        },
      },
      {
        $match: {
          category: { $ne: 'groceries' },
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          title: 1,
        },
      },
    ],
    cursor: {},
  });

  const { cursor } = res as AggregateCommandResult;
  const batch = Array.isArray(cursor?.firstBatch)
    ? (cursor.firstBatch as AutocompleteSuggestion[])
    : [];
  return normalizeSuggestions(batch);
}

/** Works without Atlas Search autocomplete mapping. */
async function regexAutocomplete(query: string) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const res = await prisma.$runCommandRaw({
    aggregate: 'Product',
    pipeline: [
      {
        $match: {
          category: { $ne: 'groceries' },
          title: { $regex: escaped, $options: 'i' },
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          title: 1,
        },
      },
    ],
    cursor: {},
  });

  const { cursor } = res as AggregateCommandResult;
  const batch = Array.isArray(cursor?.firstBatch)
    ? (cursor.firstBatch as AutocompleteSuggestion[])
    : [];
  return normalizeSuggestions(batch);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get('q') || '').trim();
  const debug = searchParams.get('debug') === '1';

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  const debugInfo: Record<string, unknown> = {
    query,
  };

  try {
    let source: 'atlas' | 'regex' | 'none' = 'none';
    let suggestions: { id: string; title: string }[] = [];
    let atlasError: string | null = null;

    // 1) Prefer Atlas Search autocomplete when the index supports it.
    try {
      suggestions = await atlasAutocomplete(query);
      source = suggestions.length > 0 ? 'atlas' : 'none';
      debugInfo.atlasCount = suggestions.length;
    } catch (error) {
      atlasError =
        error instanceof Error ? error.message : String(error);
      debugInfo.atlasError = atlasError;
      console.warn(
        '[autocomplete] Atlas $search failed, will try regex fallback:',
        atlasError,
      );
    }

    // 2) Fallback: plain regex on title (works with your current data).
    if (suggestions.length === 0) {
      suggestions = await regexAutocomplete(query);
      source = suggestions.length > 0 ? 'regex' : source;
      debugInfo.regexCount = suggestions.length;
    }
    if (debug) {
      console.log('[autocomplete]', {
        query,
        source,
        count: suggestions.length,
        suggestions,
        atlasError,
      });
    }

    return NextResponse.json({
      suggestions,
      ...(debug
        ? {
            debug: {
              ...debugInfo,
              source,
              hint:
                source === 'regex'
                  ? 'Atlas autocomplete returned no hits. Your Search index likely has no autocomplete mapping on title. Regex fallback was used. In Atlas UI → Search indexes → edit "default" → map title as type autocomplete (and keep string if needed), then reindex.'
                  : source === 'atlas'
                    ? 'Atlas autocomplete worked.'
                    : 'No matches from Atlas or regex.',
            },
          }
        : {}),
    });
  } catch (error) {
    console.error('❌ Prisma error:', error);
    return NextResponse.json(
      {
        suggestions: [],
        error: 'Failed to fetch suggestions',
        ...(debug
          ? {
              detail:
                error instanceof Error
                  ? error.message
                  : String(error),
            }
          : {}),
      },
      { status: 500 },
    );
  }
}
