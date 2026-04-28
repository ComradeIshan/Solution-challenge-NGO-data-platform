export const NGO_INSIGHT_SCHEMA_DESCRIPTION = `
You are an NGO intelligence analyst for UnityNet — a platform that connects volunteers, donors, and NGOs.
 
Analyze the given NGO website URL and generate a structured JSON report.
 
The JSON must strictly follow this schema — no extra fields, no renamed fields, no removed fields:
 
{
  "ngoSummary": {
    "name": "Full official name of the NGO",
    "website": "The URL provided",
    "mission": "Core mission statement in 1-2 sentences",
    "location": "Primary city/country of operation",
    "targetGroups": ["Group 1", "Group 2"],
    "focusAreas": ["Area 1", "Area 2", "Area 3"]
  },
  "problemAreasDetected": [
    {
      "title": "Short title of the problem",
      "description": "2-3 sentence explanation of the social problem this NGO addresses",
      "severity": "Low | Medium | High",
      "evidenceFromWebsite": "What on the website or public knowledge indicates this problem"
    }
  ],
  "volunteerNeeds": [
    {
      "role": "Volunteer role title",
      "reason": "Why this role is needed",
      "priority": "Low | Medium | High"
    }
  ],
  "impactInsights": [
    {
      "title": "Impact title",
      "insight": "What impact this NGO has or aims to have",
      "metricOrEvidence": "Any metric, statistic, or evidence. If not available, write: Not clearly available on website"
    }
  ],
  "unityNetSuggestions": [
    {
      "title": "Suggestion title",
      "suggestion": "Specific way UnityNet could help this NGO",
      "expectedBenefit": "Expected positive outcome from this suggestion"
    }
  ],
  "aiScoreCards": [
    {
      "label": "Score label (e.g. Transparency, Impact Clarity, Volunteer Readiness, Digital Presence, Community Reach, Donation Worthiness)",
      "score": 75,
      "reason": "Brief reason for the score"
    }
  ]
}
 
Important rules:
- Output ONLY valid JSON. No markdown. No explanation outside JSON.
- Do not claim exact facts unless publicly known. If uncertain, write: "Not clearly available on website"
- problemAreasDetected must have 2 to 4 items
- volunteerNeeds must have 2 to 4 items
- impactInsights must have 2 to 4 items
- unityNetSuggestions must have 2 to 4 items
- aiScoreCards must have exactly 6 items with labels: Transparency, Impact Clarity, Volunteer Readiness, Digital Presence, Community Reach, Donation Worthiness
- severity must be exactly one of: Low, Medium, High
- priority must be exactly one of: Low, Medium, High
- score must be a number between 0 and 100
`;
 
const VALID_SEVERITIES = ["Low", "Medium", "High"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];
const SCORE_CARD_LABELS = [
  "Transparency",
  "Impact Clarity",
  "Volunteer Readiness",
  "Digital Presence",
  "Community Reach",
  "Donation Worthiness",
];
 
export const DEFAULT_NGO_INSIGHT_RESULT = {
  ngoSummary: {
    name: "Unknown NGO",
    website: "",
    mission: "Not clearly available on website",
    location: "Not clearly available on website",
    targetGroups: ["General public"],
    focusAreas: ["Social welfare"],
  },
  problemAreasDetected: [
    {
      title: "Data unavailable",
      description: "Could not extract problem area information from this NGO.",
      severity: "Medium",
      evidenceFromWebsite: "Not clearly available on website",
    },
  ],
  volunteerNeeds: [
    {
      role: "General Volunteer",
      reason: "NGOs typically need general volunteers for various activities.",
      priority: "Medium",
    },
  ],
  impactInsights: [
    {
      title: "Impact data unavailable",
      insight: "Could not extract impact data from this NGO's public information.",
      metricOrEvidence: "Not clearly available on website",
    },
  ],
  unityNetSuggestions: [
    {
      title: "Connect with volunteers",
      suggestion: "Use UnityNet to connect this NGO with skilled volunteers.",
      expectedBenefit: "Increased capacity and outreach.",
    },
  ],
  aiScoreCards: SCORE_CARD_LABELS.map((label) => ({
    label,
    score: 50,
    reason: "Insufficient data to evaluate accurately.",
  })),
};
 
function clampScore(val) {
  const n = Number(val);
  if (isNaN(n)) return 50;
  return Math.min(100, Math.max(0, Math.round(n)));
}
 
function normalizeSeverity(val) {
  if (VALID_SEVERITIES.includes(val)) return val;
  return "Medium";
}
 
function normalizePriority(val) {
  if (VALID_PRIORITIES.includes(val)) return val;
  return "Medium";
}
 
function ensureArray(val) {
  if (Array.isArray(val)) return val;
  if (val && typeof val === "object") return [val];
  return [];
}
 
function ensureStringArray(val) {
  const arr = ensureArray(val);
  return arr.map((v) => (typeof v === "string" ? v : String(v)));
}
 
export function normalizeNgoInsightResult(raw, websiteUrl) {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_NGO_INSIGHT_RESULT, ngoSummary: { ...DEFAULT_NGO_INSIGHT_RESULT.ngoSummary, website: websiteUrl || "" } };
 
  const def = DEFAULT_NGO_INSIGHT_RESULT;
 
  // ngoSummary
  const rawSummary = raw.ngoSummary || {};
  const ngoSummary = {
    name: rawSummary.name || def.ngoSummary.name,
    website: rawSummary.website || websiteUrl || def.ngoSummary.website,
    mission: rawSummary.mission || def.ngoSummary.mission,
    location: rawSummary.location || def.ngoSummary.location,
    targetGroups: ensureStringArray(rawSummary.targetGroups).length > 0 ? ensureStringArray(rawSummary.targetGroups) : def.ngoSummary.targetGroups,
    focusAreas: ensureStringArray(rawSummary.focusAreas).length > 0 ? ensureStringArray(rawSummary.focusAreas) : def.ngoSummary.focusAreas,
  };
 
  // problemAreasDetected
  const problemAreasDetected = ensureArray(raw.problemAreasDetected).map((item) => ({
    title: item.title || "Untitled Problem",
    description: item.description || "No description provided.",
    severity: normalizeSeverity(item.severity),
    evidenceFromWebsite: item.evidenceFromWebsite || "Not clearly available on website",
  }));
 
  // volunteerNeeds
  const volunteerNeeds = ensureArray(raw.volunteerNeeds).map((item) => ({
    role: item.role || "General Volunteer",
    reason: item.reason || "No reason provided.",
    priority: normalizePriority(item.priority),
  }));
 
  // impactInsights
  const impactInsights = ensureArray(raw.impactInsights).map((item) => ({
    title: item.title || "Untitled Insight",
    insight: item.insight || "No insight provided.",
    metricOrEvidence: item.metricOrEvidence || "Not clearly available on website",
  }));
 
  // unityNetSuggestions
  const unityNetSuggestions = ensureArray(raw.unityNetSuggestions).map((item) => ({
    title: item.title || "Untitled Suggestion",
    suggestion: item.suggestion || "No suggestion provided.",
    expectedBenefit: item.expectedBenefit || "No expected benefit specified.",
  }));
 
  // aiScoreCards — always ensure exactly 6 with correct labels
  const rawScoreCards = ensureArray(raw.aiScoreCards);
  const aiScoreCards = SCORE_CARD_LABELS.map((label) => {
    const found = rawScoreCards.find(
      (c) => c.label && c.label.toLowerCase().trim() === label.toLowerCase().trim()
    );
    if (found) {
      return {
        label,
        score: clampScore(found.score),
        reason: found.reason || "No reason provided.",
      };
    }
    // fallback: use by index if label doesn't match
    const byIndex = rawScoreCards[SCORE_CARD_LABELS.indexOf(label)];
    if (byIndex) {
      return {
        label,
        score: clampScore(byIndex.score),
        reason: byIndex.reason || "No reason provided.",
      };
    }
    return { label, score: 50, reason: "Insufficient data to evaluate accurately." };
  });
 
  return {
    ngoSummary,
    problemAreasDetected: problemAreasDetected.length > 0 ? problemAreasDetected : def.problemAreasDetected,
    volunteerNeeds: volunteerNeeds.length > 0 ? volunteerNeeds : def.volunteerNeeds,
    impactInsights: impactInsights.length > 0 ? impactInsights : def.impactInsights,
    unityNetSuggestions: unityNetSuggestions.length > 0 ? unityNetSuggestions : def.unityNetSuggestions,
    aiScoreCards,
  };
}