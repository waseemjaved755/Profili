export const MESSAGE_INTENTS = [
  "job_opportunity",
  "question",
  "introduction",
  "other",
] as const;

export type MessageIntent = (typeof MESSAGE_INTENTS)[number];

export type FunctionTool = {
  type: "function";
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
    additionalProperties: false;
  };
};

export const LEAVE_MESSAGE_TOOL: FunctionTool = {
  type: "function",
  name: "leave_message_for_owner",
  description:
    "Save a short message for {full_name}. Call only after the visitor clearly says they want to leave a message for {full_name}. Repeat the message back briefly and wait for confirmation before calling, because transcription can be wrong.",
  parameters: {
    type: "object",
    properties: {
      message: {
        type: "string",
        minLength: 1,
        maxLength: 500,
        description: "The confirmed message in the visitor's words, 1-500 characters.",
      },
      intent: {
        type: "string",
        enum: [...MESSAGE_INTENTS],
        description: "Closest purpose: job_opportunity, question, introduction, or other.",
      },
    },
    required: ["message"],
    additionalProperties: false,
  },
};

export const SHARE_BOOKING_TOOL: FunctionTool = {
  type: "function",
  name: "share_booking_link",
  description:
    "Show the visitor a booking link when they want to schedule a call or meeting. Never read the URL aloud; say the link is now on their screen.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
};

export function leaveMessageTool(fullName: string): FunctionTool {
  return {
    ...LEAVE_MESSAGE_TOOL,
    description: LEAVE_MESSAGE_TOOL.description.replaceAll("{full_name}", fullName),
  };
}

export function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildVoiceTools(input: { fullName: string; bookingUrl: string | null }) {
  const tools: FunctionTool[] = [leaveMessageTool(input.fullName)];
  if (input.bookingUrl && isHttpsUrl(input.bookingUrl)) {
    tools.push(SHARE_BOOKING_TOOL);
  }
  return tools;
}

export function toolPromptLines(tools: FunctionTool[], fullName: string) {
  const names = new Set(tools.map((tool) => tool.name));
  const lines: string[] = [];
  if (names.size === 0) return lines;

  lines.push(
    "The call lasts 30 seconds, so after your first answer, offer the available tools if they fit.",
  );
  if (names.has("leave_message_for_owner")) {
    lines.push(
      `Offer to leave a message for ${fullName} if they want a follow-up. Before calling leave_message_for_owner, briefly repeat the message back and wait for confirmation.`,
    );
  }
  if (names.has("share_booking_link")) {
    lines.push(
      "If they want to schedule a call or meeting, call share_booking_link. Never read a URL aloud; say the link is now on their screen.",
    );
  }
  lines.push("Never ask for the visitor's name or email. You already have them.");
  lines.push("Never promise a reply time.");
  lines.push(
    "If a tool returns ok:false, apologize briefly and suggest emailing the owner directly.",
  );
  return lines;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function assertFunctionToolSchema(tool: FunctionTool) {
  if (tool.type !== "function") throw new Error(`${tool.name}: type must be function`);
  if (!tool.name || !/^[a-z][a-z0-9_]*$/.test(tool.name)) {
    throw new Error(`${tool.name}: invalid name`);
  }
  if (typeof tool.description !== "string" || !tool.description.trim()) {
    throw new Error(`${tool.name}: description required`);
  }
  const params = tool.parameters;
  if (!isPlainObject(params) || params.type !== "object") {
    throw new Error(`${tool.name}: parameters.type must be object`);
  }
  if (params.additionalProperties !== false) {
    throw new Error(`${tool.name}: additionalProperties must be false`);
  }
  if (!isPlainObject(params.properties)) {
    throw new Error(`${tool.name}: properties must be an object`);
  }
  if (!Array.isArray(params.required) || !params.required.every((key) => typeof key === "string")) {
    throw new Error(`${tool.name}: required must be a string array`);
  }
  for (const key of params.required) {
    if (!(key in params.properties)) {
      throw new Error(`${tool.name}: required field ${key} missing from properties`);
    }
  }
}

export function assertRegisteredToolSchemas(tools: FunctionTool[]) {
  for (const tool of tools) assertFunctionToolSchema(tool);
  const leave = tools.find((tool) => tool.name === "leave_message_for_owner");
  if (leave) {
    const message = leave.parameters.properties.message as { type?: string; minLength?: number; maxLength?: number };
    const intent = leave.parameters.properties.intent as { enum?: string[] };
    if (message?.type !== "string" || message.minLength !== 1 || message.maxLength !== 500) {
      throw new Error("leave_message_for_owner: message must be string 1-500");
    }
    if (!leave.parameters.required.includes("message")) {
      throw new Error("leave_message_for_owner: message is required");
    }
    if (JSON.stringify(intent?.enum) !== JSON.stringify([...MESSAGE_INTENTS])) {
      throw new Error("leave_message_for_owner: intent enum mismatch");
    }
  }
  const booking = tools.find((tool) => tool.name === "share_booking_link");
  if (booking && booking.parameters.required.length !== 0) {
    throw new Error("share_booking_link: must have no required parameters");
  }
  return tools;
}
