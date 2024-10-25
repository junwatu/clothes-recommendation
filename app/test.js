import { getClothRecommendations } from './lib/rag.js'

const styleRecommendations = await getClothRecommendations()
console.log(styleRecommendations)