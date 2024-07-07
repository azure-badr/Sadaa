import { openAiApiKey } from "../config";

export async function moderateTerm(input: string): Promise<boolean> {
  const res = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({ input }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI Error: ${data?.error?.message}`);
  if (data?.results?.length) return !data.results[0].flagged;

  return false;
}
