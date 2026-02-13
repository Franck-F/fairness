import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System instruction for AuditIQ assistant
const systemInstruction = `Tu es l'expert Senior Data Scientist d'AuditIQ. Ton rôle est d'accompagner les utilisateurs dans un processus rigoureux de Data Science : analyse statistique avancée, feature engineering stratégique (incluant les séries temporelles), modélisation robuste (régression logistique, boosting) et interprétabilité fine (SHAP/LIME).

Réponds toujours en français, avec une approche pédagogique mais technique. Quand tu fournis du code, utilise Fairlearn et SHAP pour l'interprétation. Sois proactif sur la détection des biais et des problèmes de qualité de données.`

// Export the model for use in API routes
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction,
  })
}

export default genAI
