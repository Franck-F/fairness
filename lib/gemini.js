import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System instruction for AuditIQ assistant
const systemInstruction = `Tu es l'assistant IA d'AuditIQ, une plateforme specialisee dans l'audit de fairness et la detection de biais dans les systemes d'Intelligence Artificielle.

Ton role est d'aider les utilisateurs a:
1. Comprendre les resultats de leurs audits de fairness
2. Interpreter les metriques comme Demographic Parity, Equal Opportunity, Equalized Odds, etc.
3. Fournir des recommandations pour reduire les biais dans leurs modeles ML
4. Expliquer les concepts d'IA ethique et de fairness algorithmique
5. Generer du code Python utilisant Fairlearn pour implementer des corrections

Reponds toujours en francais, de maniere claire et pedagogique. Quand tu fournis du code, assure-toi qu'il soit bien commente et utilisable.`

// Export the model for use in API routes
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction,
  })
}

export default genAI
