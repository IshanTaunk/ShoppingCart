import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;
const DEFAULT_MODEL = 'gpt-4o-mini';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ToolDefinition = {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
};

export type ToolUseBlock = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type AICompletionOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
};

function buildMessages(
  messages: ChatMessage[],
  systemPrompt?: string,
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] =
    [];
  if (systemPrompt) {
    apiMessages.push({
      role: 'system',
      content: systemPrompt,
    });
  }
  for (const msg of messages) {
    apiMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }
  return apiMessages;
}

function convertToolsToOpenAI(
  tools: ToolDefinition[],
): OpenAI.Chat.ChatCompletionTool[] {
  return tools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  }));
}

function requireOpenAI(): OpenAI {
  if (!openai) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }
  return openai;
}

export async function getAICompletionWithTools(
  messages: ChatMessage[],
  tools: ToolDefinition[],
  options: AICompletionOptions = {},
): Promise<{
  content: string | null;
  toolUse: ToolUseBlock | null;
  stopReason: string;
}> {
    const {
        model = DEFAULT_MODEL,
        temperature = 0.7,
        maxTokens = 1000,
        systemPrompt,
    } = options;

  const apiMessages = buildMessages(messages, systemPrompt);
  const openaiTools = convertToolsToOpenAI(tools);

  const response =
    await requireOpenAI().chat.completions.create({
      model,
      messages: apiMessages,
      tools: openaiTools,
      max_tokens: maxTokens,
      temperature,
    });

  const choice = response.choices[0];
  const message = choice?.message;
  const toolCalls = message?.tool_calls;

  const content: string | null =
  message?.content?.trim() ?? null;
  let toolUse: ToolUseBlock | null = null;
  let stopReason = choice?.finish_reason ?? 'stop';

  if (toolCalls && toolCalls.length > 0) {
    const toolCall = toolCalls[0];
     if (toolCall.type === 'function') {
        stopReason = 'tool_calls';
        toolUse = {
          type: 'tool_use',
          id: toolCall.id,
          name: toolCall.function.name,
          input: (() => {
            try {
              return JSON.parse(
                toolCall.function.arguments || '{}',
              ) as Record<string, unknown>;
            } catch {
              return {};
            }
          })(),
        };
     }
  }

  return {
    content,
    toolUse,
    stopReason,
  };
};
