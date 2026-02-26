import Groq from "groq-sdk";

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};

/* ==============================
   1️⃣ Chat Assistant
================================= */
export const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const groq = getGroqClient();

    const systemPrompt = `You are a helpful AI assistant for LifeOS, a productivity and personal management platform.
Help users with:
- Task prioritization and suggestions
- Goal planning and milestone creation
- Time management tips
- Productivity insights
- Natural language task/goal/event creation

Be concise, actionable, and supportive.
${context ? `User context: ${JSON.stringify(context)}` : ""}`;

    const completion = await groq.chat.completions.create({
      model: "groq/compound", // ✅ Updated model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_completion_tokens: 1024,
    });

    res.json({
      message:
        completion.choices?.[0]?.message?.content ||
        "I apologize, but I could not generate a response.",
    });
  } catch (error) {
    console.error("Chat AI Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   2️⃣ Productivity Insights
================================= */
export const getProductivityInsights = async (req, res) => {
  try {
    const { tasksData, goalsData } = req.body;

    const groq = getGroqClient();

    const prompt = `Analyze this productivity data and provide 3-5 actionable insights:

Tasks: ${JSON.stringify(tasksData)}
Goals: ${JSON.stringify(goalsData)}

Provide insights about:
1. Task completion patterns
2. Goal progress
3. Priority management
4. Productivity trends
5. Recommendations for improvement

Format strictly as a JSON array:
[
  { "title": "string", "description": "string" }
]`;

    const completion = await groq.chat.completions.create({
      model: "groq/compound", // ✅ Updated model
      messages: [
        {
          role: "system",
          content:
            "You are a productivity analytics AI. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_completion_tokens: 1024,
    });

    const content = completion.choices?.[0]?.message?.content || "[]";

    try {
      const insights = JSON.parse(content);
      res.json({ insights });
    } catch {
      res.json({
        insights: [
          {
            title: "AI Analysis",
            description: content,
          },
        ],
      });
    }
  } catch (error) {
    console.error("Insights Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ==============================
   3️⃣ Natural Language Parser
================================= */
export const parseNaturalLanguage = async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text || !type) {
      return res.status(400).json({ message: "Text and type are required" });
    }

    const groq = getGroqClient();

    const prompt = `Extract structured data from this natural language input for a ${type}:

"${text}"

Return ONLY valid JSON.`;

    const completion = await groq.chat.completions.create({
      model: "groq/compound", // ✅ Updated model
      messages: [
        {
          role: "system",
          content:
            "You are a natural language parsing AI. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_completion_tokens: 512,
    });

    const content = completion.choices?.[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(content);
      res.json(parsed);
    } catch {
      res.status(500).json({
        message: "AI returned invalid JSON",
        raw: content,
      });
    }
  } catch (error) {
    console.error("Parser Error:", error);
    res.status(500).json({ message: error.message });
  }
};
