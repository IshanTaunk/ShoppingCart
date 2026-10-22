import { checkRateLimit, RateLimitError } from '@/app/lib/ai/rate-limiter';
import { ExtractedFilters, isNaturalLanguageQuery, processNaturalLanguageQuery } from '@/app/lib/ai/search-processor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

    try{
        let body: unknown;
        try{
            body = await request.json();
        }catch(error){
            return NextResponse.json(
            { error: 'Malformed JSON' },
            { status: 400 },
        );
        }
        const { query } = body as { query?: unknown };
        if (!query || typeof query !== 'string') {
            return NextResponse.json(
            { error: 'Query is required' },
            { status: 400 },
        );
        }

        // Rate limiting by IP
        const ip =
        request.headers.get('x-forwarded-for') || 'anonymous';
        try {
        checkRateLimit(`ai-search:${ip}`, {
            maxRequests: 20,
            windowMs: 60 * 1000, // 20 requests per minute
        });
        } catch (error) {
        if (error instanceof RateLimitError) {
            return NextResponse.json(
            { error: error.message },
            { status: 429 },
            );
        }
        throw error;
        }

        // Check if this is a natural language query
        const isNaturalLanguage = isNaturalLanguageQuery(query);

        if (!isNaturalLanguage) {
        // Return simple keyword search
        return NextResponse.json({
            isNaturalLanguage: false,
            filters: {
            keywords: query,
            category: null,
            priceMin: null,
            priceMax: null,
            attributes: {
                color: null,
                style: null,
                material: null,
            },
            interpretation: '',
            } as ExtractedFilters,
        });
        }

        // Process natural language query
        const filters = await processNaturalLanguageQuery(query);

        return NextResponse.json({
        isNaturalLanguage: true,
        filters,
        });
    }catch(error){
        console.error('Error processing AI search:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to process search query';

    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        return NextResponse.json(
          {
            error:
              'Insufficient funds in OpenAI account. Please check your billing.',
          },
          { status: 402 },
        );
      }
      if (error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          {
            error:
              'Rate limit exceeded. Please try again later.',
          },
          { status: 429 },
        );
      }
      if (error.message.includes('Authentication failed')) {
        return NextResponse.json(
          {
            error:
              'API authentication failed. Please check configuration.',
          },
          { status: 401 },
        );
      }
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
    }
}