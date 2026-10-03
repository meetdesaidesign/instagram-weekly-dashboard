export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },
} as const;

export function isOpenAIConfigured(): boolean {
  return Boolean(config.openai.apiKey);
}
