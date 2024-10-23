import { extractRelevantFeatures } from './lib/rag.js'

const styleRecommendations = await extractRelevantFeatures()

console.log(styleRecommendations)