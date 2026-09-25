import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client if API key is available
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'JALRAKSHA Post-Flood WASH DSS',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Report Extraction & Disaster Information Extraction
app.post('/api/analyze-report', async (req, res) => {
  const { text, reportType, location } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text description is required' });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the AI engine of JALRAKSHA, an Earth Observation and Post-Flood WASH Emergency Decision Support System.
Analyze this disaster field observation report from a flood-affected community in Nepal:

Report Text: "${text}"
Reported Location: "${location || 'Unknown'}"
Report Category: "${reportType || 'Unspecified'}"

Extract structured disaster response information in JSON format with these exact keys:
- detectedLocation: string (inferred village/ward/district)
- infrastructureImpacted: string (e.g., tube well, sanitation latrine, culvert, health post)
- damageCondition: string (concise summary of damage, e.g., submerged under 1.5m silt, superstructure collapsed)
- estimatedSeverity: string ("CRITICAL" | "HIGH" | "MODERATE" | "LOW")
- washThreatVectors: array of strings (e.g., ["Water source microbial contamination", "Displacement to open defecation", "Diarrheal outbreak risk"])
- confidenceScore: number (between 0.70 and 0.98)
- recommendedEmergencyAction: string (immediate humanitarian intervention needed, e.g., deploy water purification tablets, tankering, bladders)
- classificationRationale: string (1-2 sentences explaining why this severity was assigned)

Return ONLY valid JSON matching this schema, without markdown fences if possible.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        source: 'gemini-3.8-flash',
        data: parsed,
      });
    } catch (error: any) {
      console.warn('Gemini API call failed, falling back to heuristic disaster parser:', error?.message);
    }
  }

  // Deterministic rule-based fallback for offline / demo mode
  const lower = (text || '').toLowerCase();
  let severity = 'MODERATE';
  if (lower.includes('contaminat') || lower.includes('submerged') || lower.includes('broken') || lower.includes('no drinking') || lower.includes('stranded') || lower.includes('overflow') || lower.includes('feces') || lower.includes('cholera') || lower.includes('death') || lower.includes('critical')) {
    severity = 'CRITICAL';
  } else if (lower.includes('damaged') || lower.includes('limited') || lower.includes('blocked') || lower.includes('leak') || lower.includes('shallow') || lower.includes('turbid')) {
    severity = 'HIGH';
  }

  const infra = lower.includes('pump') || lower.includes('well') || lower.includes('tap') || lower.includes('water')
    ? 'Hand Pump / Tube Well'
    : lower.includes('toilet') || lower.includes('latrine') || lower.includes('sewage')
    ? 'Community Sanitation Facility'
    : lower.includes('bridge') || lower.includes('road') || lower.includes('culvert')
    ? 'Access Road / Transport Link'
    : lower.includes('health') || lower.includes('clinic') || lower.includes('hospital')
    ? 'Primary Health Facility'
    : 'WASH Infrastructure';

  const threatVectors: string[] = [];
  if (infra.includes('Pump') || infra.includes('Water')) {
    threatVectors.push('Aquifer floodwater intrusion & biological pathogen risk');
    threatVectors.push('Immediate loss of potable water for vulnerable households');
  }
  if (infra.includes('Sanitation') || infra.includes('Toilet')) {
    threatVectors.push('Fecal sludge contamination of surface floodwaters');
    threatVectors.push('Loss of dignified safe hygiene facilities, open defecation risk');
  }
  if (infra.includes('Road') || infra.includes('Bridge')) {
    threatVectors.push('Isolation preventing emergency water tankering and chlorine tablet delivery');
  }
  if (threatVectors.length === 0) {
    threatVectors.push('WASH service interruption and hygiene vulnerability');
  }

  res.json({
    success: true,
    source: 'heuristic-rules-engine (DEMONSTRATION MODE)',
    data: {
      detectedLocation: location || 'Identified Flood Zone, Koshi Basin',
      infrastructureImpacted: infra,
      damageCondition: text.length > 80 ? text.slice(0, 80) + '...' : text,
      estimatedSeverity: severity,
      washThreatVectors: threatVectors,
      confidenceScore: 0.91,
      recommendedEmergencyAction: severity === 'CRITICAL' 
        ? 'Immediate distribution of Point-of-Use water purification sachets (Aquatabs/PUR), rapid deployment of 5,000L mobile bladder tank, emergency disinfection crew dispatch.'
        : 'Chlorination monitoring, temporary elevated sanitation trench provision, and accessibility clearance.',
      classificationRationale: `Text contains indicators of ${severity.toLowerCase()} disruption affecting ${infra.toLowerCase()}. Flagged for priority ground verification.`,
    },
  });
});

// Production or Vite Middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JALRAKSHA Server running on port ${PORT}`);
  });
}

start();
