# Prompt Rules

1. Always include schema before generating code
2. Do not invent new fields
3. Follow existing folder structure
4. Use consistent naming conventions
5. Use Firebase Firestore as database
6. Backend handles all AI calls (Gemini)
7. Keep functions modular
8. Avoid unnecessary complexity

Rule 1: ALWAYS give schema                       //By following all these rules we can stop AI from Hallucinating.
 Example - Here is the Report schema:
{
  title: string,
  category: string,
  severityScore: number
}

Generate code strictly using this schema.
Do not add extra fields.

Rule 2: Give file context
 This file is part of a React + Firebase project.
Use ES6 modules.
Follow folder structure.

Rule 3: Never generate isolated files blindly
 Instead:
👉 “Generate controller + service + route together”

Rule 4: Use shared constants

👉 categories.js
→ prevents mismatch across files