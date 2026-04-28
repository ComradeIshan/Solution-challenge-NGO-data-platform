import {
  NGO_INSIGHT_SCHEMA_DESCRIPTION,
  normalizeNgoInsightResult,
} from "./ngoInsightSchema.js";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function buildPrompt(websiteUrl) {
  return `Analyze the following NGO website and generate a detailed intelligence report for DigitalSevaks.
 
NGO Website URL: ${websiteUrl}
 
Instructions:
- Use publicly available knowledge about this NGO based on its URL and domain name.
- If the NGO is well known, use accurate information.
- If you are not certain about specific facts, write: "Not clearly available on website"
- Do NOT make up statistics or metrics.
- Respond ONLY with valid JSON that strictly follows the schema below.
- Do NOT include markdown code blocks.
- Do NOT include any explanation before or after the JSON.
- The JSON must be complete and parseable.
 
${NGO_INSIGHT_SCHEMA_DESCRIPTION}
 
Generate the JSON report now for: ${websiteUrl}`;
}

export async function analyzeNgoWebsiteWithGroq(websiteUrl) {
  // Validate API key
  if (!GROQ_API_KEY || GROQ_API_KEY.trim() === "") {
    throw new Error(
      "Groq API key is missing. Add VITE_GROQ_API_KEY in your frontend .env file.",
    );
  }

  // Validate URL
  if (!websiteUrl || websiteUrl.trim() === "") {
    throw new Error("Please enter a valid NGO website URL.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(websiteUrl.trim());
  } catch {
    throw new Error(
      "The URL you entered is not valid. Please enter a full URL like https://www.example-ngo.org",
    );
  }

  const cleanUrl = parsedUrl.href;

  // Call Groq API
  let response;
  try {
    response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert NGO intelligence analyst for DigitalSevaks. You generate structured JSON reports about NGOs to help volunteers, donors, CSR teams, and partner organizations make informed decisions. Always respond with valid JSON only. No markdown. No explanation outside JSON.",
          },
          {
            role: "user",
            content: buildPrompt(cleanUrl),
          },
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    });
  } catch (networkError) {
    throw new Error(
      "Network error while connecting to Groq API. Please check your internet connection and try again.",
    );
  }

  // Handle HTTP errors
  if (!response.ok) {
    let errorMessage = `Groq API returned status ${response.status}.`;
    try {
      const errData = await response.json();
      if (errData?.error?.message) {
        errorMessage = `Groq API error: ${errData.error.message}`;
      }
    } catch {
      // ignore parse error on error response
    }

    if (response.status === 401) {
      throw new Error(
        "Invalid Groq API key. Please check your VITE_GROQ_API_KEY in the .env file.",
      );
    }
    if (response.status === 429) {
      throw new Error(
        "Groq API rate limit reached. Please wait a moment and try again.",
      );
    }
    if (response.status === 503 || response.status === 500) {
      throw new Error(
        "Groq API is temporarily unavailable. Please try again in a few seconds.",
      );
    }
    throw new Error(errorMessage);
  }

  // Parse response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Could not parse response from Groq API. Please try again.",
    );
  }

  // Extract content
  const rawContent = data?.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Groq API returned an empty response. Please try again.");
  }

  // Parse JSON from content
  let parsedResult;
  try {
    // Strip any accidental markdown fences
    const cleaned = rawContent
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    parsedResult = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "The AI response could not be parsed as structured data. Please try again — this sometimes happens with complex NGO websites.",
    );
  }

  // Normalize and return
  return normalizeNgoInsightResult(parsedResult, cleanUrl);
}
