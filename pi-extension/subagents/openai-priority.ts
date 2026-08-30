import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const OPENAI_PROVIDERS = new Set(["openai", "openai-codex"]);

export type OpenAIServiceTier = "default" | "priority";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function resolveOpenAIServiceTier(
  value: string | undefined,
): OpenAIServiceTier | undefined {
  if (value === "default" || value === "priority") return value;
  return undefined;
}

export function applyOpenAIServiceTier(
  model: Pick<NonNullable<ExtensionContext["model"]>, "provider"> | undefined,
  payload: unknown,
  serviceTier: OpenAIServiceTier | undefined,
): unknown | undefined {
  if (
    !serviceTier ||
    !model ||
    !OPENAI_PROVIDERS.has(model.provider) ||
    !isRecord(payload)
  ) {
    return undefined;
  }

  return { ...payload, service_tier: serviceTier };
}

export default function openAIServiceTierExtension(pi: ExtensionAPI): void {
  pi.on("before_provider_request", (event, ctx) =>
    applyOpenAIServiceTier(
      ctx.model,
      event.payload,
      resolveOpenAIServiceTier(process.env.PI_SUBAGENT_OPENAI_SERVICE_TIER),
    ),
  );
}
