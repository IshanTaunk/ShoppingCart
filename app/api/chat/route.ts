import { getProducts } from "@/app/actions/fetchProducts";
import getProductById from "@/app/actions/getProductsById";
import { getAICompletionWithTools, ToolDefinition } from "@/app/lib/ai/openai-client";
import { CHAT_ASSISTANT_SYSTEM_PROMPT, formatCartContext } from "@/app/lib/ai/prompts/chat-assistant";
import { checkRateLimit, RateLimitError } from "@/app/lib/ai/rate-limiter";
import { NextRequest, NextResponse } from "next/server";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
): Promise<string> {
  switch (toolName) {
    case 'searchProducts': {
      const { query, category, priceMax } = toolInput as {
        query: string;
        category?: string;
        priceMax?: number;
      };
      const products = await getProducts({
        query,
        category,
        priceMax,
        limit: 5,
      });
      if (!products || products.length === 0) {
        return 'No products found matching your criteria.';
      }
      return products
        .slice(0, 5)
        .map(
          (p: (typeof products)[0]) =>
            `- ${p.title} ($${p.price.toFixed(2)}) - ${p.category} — Visit product: [ID: ${p.id}]`,
        )
        .join('\n');
    }
    case 'getProductDetails': {
      const { productId } = toolInput as {
        productId: string;
      };
      const p = await getProductById(productId);
      if (!p) {
        return 'Product not found.';
      }

      // Align "in stock" logic with the product page UI.
      // Prefer explicit boolean `inStock` when present, otherwise fall back to
      // availabilityStatus and stock quantity.
      const hasExplicitInStock =
        typeof p.inStock === 'boolean';
      const normalizedAvailability =
        (p).availabilityStatus
          ?.toString()
          .toLowerCase() ?? '';
      const stockCount =
        typeof p.stock === 'number' ? p.stock : null;

      const isInStock = hasExplicitInStock
        ? !!p.inStock
        : normalizedAvailability === 'in stock' ||
          (stockCount !== null && stockCount > 0);

      const availabilityLabel =
        (p).availabilityStatus ||
        (isInStock ? 'In Stock' : 'Out of Stock');

      const stockLabel =
        stockCount !== null
          ? `${stockCount} unit(s) available`
          : 'Unknown';

      return `Product: ${p.title}
Price: $${p.price.toFixed(2)}
Category: ${p.category}
Brand: ${p.brand || 'N/A'}
Description: ${(p.description || '').substring(0, 300)}${(p.description?.length ?? 0) > 300 ? '...' : ''}
In Stock: ${isInStock ? 'Yes' : 'No'}
Availability: ${availabilityLabel}
Stock: ${stockLabel}
Visit product: [ID: ${p.id}]`;
    }
    case 'getCartSuggestions': {
      const { cartCategories } = toolInput as {
        cartCategories: string[];
      };
      // Find complementary products
      const suggestions: string[] = [];
      for (const category of cartCategories.slice(0, 2)) {
        const products = await getProducts({
          category,
          limit: 3,
        });
        if (products && products.length > 0) {
          suggestions.push(
            ...products
              .slice(0, 2)
              .map(
                (p: (typeof products)[0]) =>
                  `- ${p.title} ($${p.price.toFixed(2)}) — Visit: [ID: ${p.id}]`,
              ),
          );
        }
      }
      return suggestions.length > 0
        ? `Here are some products that might complement your cart:\n${suggestions.join('\n')}`
        : 'No suggestions available at the moment.';
    }
    default:
      return 'Unknown tool';
  }
}

const chatTools: ToolDefinition[] = [
  {
    name: 'searchProducts',
    description:
      'Search for products by query and optional filters. Use this when the user asks to find products or wants recommendations.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keywords for products',
        },
        category: {
          type: 'string',
          description:
            'Product category (mens, womens, accessories, beauty)',
        },
        priceMax: {
          type: 'number',
          description: 'Maximum price filter',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getProductDetails',
    description:
      'Get detailed information about a specific product by its ID. Use when user asks about a specific product.',
    input_schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The product ID to get details for',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'getCartSuggestions',
    description:
      'Get product suggestions based on what is in the user cart. Use when user has items in cart and wants recommendations for complementary products.',
    input_schema: {
      type: 'object',
      properties: {
        cartCategories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Categories of items in the cart',
        },
      },
      required: ['cartCategories'],
    },
  },
];

export async function POST(request: NextRequest) {
  try{
    const {
        messages,
        cartItems,
    }: { messages: Message[]; cartItems: CartItem[] } =
    await request.json();
    
    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
            { error: 'Messages array is required' },
            { status: 400 },
        );
    }

    if (messages.length === 0 || messages.length > 30) {
        return NextResponse.json(
            { error: 'Messages must contain 1-30 items' },
            { status: 400 },
        );
    }

    const isValidMessage = messages.every(
        (m) =>
            (m?.role === 'user' || m?.role === 'assistant') &&
            typeof m?.content === 'string' &&
            m.content.trim().length > 0 &&
            m.content.length <= 4000,
        );

    if (!isValidMessage) {
    return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 },
    );
    }

    // Rate limiting
    const ip =
    request.headers.get('x-forwarded-for') || 'anonymous';
    try {
        checkRateLimit(`chat:${ip}`, {
            maxRequests: 30,
            windowMs: 60 * 1000, // 30 messages per minute
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

      // Build system prompt with cart context
      const cartContext = formatCartContext(cartItems || []);
      const systemPrompt = `${CHAT_ASSISTANT_SYSTEM_PROMPT}\n\nCurrent cart status:\n${cartContext}`;

      // AI call with tool use loop (up to 3 rounds for chained tool calls)
      let currentMessages: Message[] = [...messages];
      let response = await getAICompletionWithTools(
        currentMessages,
        chatTools,
        {
          systemPrompt,
          model: 'gpt-4o-mini',
          maxTokens: 500,
          temperature: 0.7,
        },
      );

      const maxToolRounds = 3;
      for (
        let round = 0;
        round < maxToolRounds &&
        response.toolUse &&
        response.stopReason === 'tool_calls';
        round++
      ) {
        const toolResult = await executeToolCall(
          response.toolUse.name,
          response.toolUse.input,
        );

        currentMessages = [
          ...currentMessages,
          {
            role: 'assistant' as const,
            content: response.content || '',
          },
          {
            role: 'user' as const,
            content: `[Tool result for ${response.toolUse.name}]: ${toolResult}`,
          },
        ];

        response = await getAICompletionWithTools(
          currentMessages,
          chatTools,
          {
            systemPrompt,
            model: 'gpt-4o-mini',
            maxTokens: 500,
            temperature: 0.7,
          },
        );
      }

      return NextResponse.json({
        message:
          response.content ||
          "I'm sorry, I couldn't generate a response.",
      });
  }catch(error){
      console.error('Error in chat API:', error);
      return NextResponse.json(
          { error: 'Failed to process chat message' },
          { status: 500 },
      );
  }
}