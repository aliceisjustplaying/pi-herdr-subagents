import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const OPENAI_PROVIDERS = new Set(["openai", "openai-codex"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function applyOpenAIPriorityServiceTier(
  model: Pick<NonNullable<ExtensionContext["model"]>, "provider"> | undefined,
  payload: unknown,
): unknown | undefined {
  if (!model || !OPENAI_PROVIDERS.has(model.provider) || !isRecord(payload)) {
    return undefined;
  }

  return { ...payload, service_tier: "priority" };
}

export default function openAIPriorityExtension(pi: ExtensionAPI): void {
  pi.on("before_provider_request", (event, ctx) =>
    applyOpenAIPriorityServiceTier(ctx.model, event.payload),
  );
}
