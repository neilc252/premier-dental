import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Seismic Dental EHR", timestamp: new Date().toISOString() });
});

// Gemini AI Assistant Endpoints
app.post("/api/gemini/soap-note", async (req, res) => {
  try {
    const { patientName, chiefComplaint, clinicalFindings, teethInvolved, procedureCode } = req.body;

    const ai = getGeminiClient();
    const prompt = `You are an expert dental scribe and clinical EHR assistant for Seismic Dental EHR.
Write a concise, professional SOAP Clinical Note based on the following patient encounter:
- Patient Name: ${patientName || "Jane Doe"}
- Chief Complaint: ${chiefComplaint || "Mild sensitivity on upper right molar"}
- Teeth Involved: ${teethInvolved ? teethInvolved.join(", ") : "Tooth #3"}
- Clinical Findings: ${clinicalFindings || "Caries observed on occlusal surface, cold test sensitive 3s"}
- Planned/Completed CDT Code: ${procedureCode || "D2391 (Composite - 1 surface, posterior)"}

Format strictly in clean markdown with the sections:
- **Subjective (S)**
- **Objective (O)**
- **Assessment (A)**
- **Plan (P)**
- **Post-Op Instructions & Next Visits**`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You generate clinical, compliant dental EHR SOAP notes with precise terminology.",
      },
    });

    res.json({ note: response.text || "Failed to generate note." });
  } catch (error: any) {
    console.error("SOAP Note AI error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during AI note generation." });
  }
});

app.post("/api/gemini/patient-explain", async (req, res) => {
  try {
    const { treatmentPlanTitle, procedures, estimatedCost } = req.body;

    const ai = getGeminiClient();
    const prompt = `You are a warm, empathetic dental coordinator explaining a dental treatment plan to a patient.
Treatment Plan: ${treatmentPlanTitle || "Restorative & Root Canal Plan"}
Procedures: ${JSON.stringify(procedures || [])}
Estimated Patient Out of Pocket: ${estimatedCost || "$350"}

Explain in clear, reassuring, non-intimidating plain English:
1. Why each procedure is necessary for their oral health.
2. What happens during the visit in simple terms.
3. How doing this now prevents costlier complications.
4. Next steps for scheduling.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ explanation: response.text || "Failed to generate patient explanation." });
  } catch (error: any) {
    console.error("Patient Explain AI error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during AI explanation." });
  }
});

app.post("/api/gemini/clinical-assist", async (req, res) => {
  try {
    const { query, context } = req.body;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Context: ${JSON.stringify(context || {})}\n\nClinical Query from Dentist/Hygienist: ${query}`,
      config: {
        systemInstruction: "You are an expert clinical dental assistant answering CDT code questions, restorative protocols, periodontal staging, or pharmacology precautions in a dental office context.",
      },
    });

    res.json({ answer: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Clinical Assist AI error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during clinical assist." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Seismic Dental EHR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
