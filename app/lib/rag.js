import 'data-forge-fs';
import OpenAI from 'openai';
import { DataFrame } from 'data-forge';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

function cosineSimilarityManual(vec1, vec2) {
	vec1 = vec1.map(Number);
	vec2 = vec2.map(Number);
	const dotProduct = vec1.reduce((sum, v1, i) => sum + v1 * vec2[i], 0);
	const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
	const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
	return dotProduct / (mag1 * mag2);
}

function findSimilarItems(inputEmbedding, embeddings, threshold = 0.5, topK = 2) {
	const similarities = embeddings.map((vec, index) =>
		[index, cosineSimilarityManual(inputEmbedding, vec)]
	);
	const filteredSimilarities = similarities.filter(([, sim]) => sim >= threshold);
	const sortedIndices = filteredSimilarities
		.sort((a, b) => b[1] - a[1])
		.slice(0, topK);
	return sortedIndices;
}

async function getEmbeddings(texts) {
	const response = await openai.embeddings.create({
		model: "text-embedding-3-large",
		input: texts,
		encoding_format: "float"
	});
	return response.data.data.map(item => item.embedding);
}

async function findMatchingItemsWithRag(itemDescs) {
	const dfItems = await DataFrame.readFileSync('your_data_file.csv')
		.parseCSV()
		.transformSeries({
			embeddings: (embeddingStr) => JSON.parse(embeddingStr)
		});

	const embeddings = dfItems.getSeries('embeddings').toArray();
	let similarItems = [];
	for (const desc of itemDescs) {
		const inputEmbedding = await getEmbeddings([desc]);
		const similarIndices = findSimilarItems(inputEmbedding[0], embeddings);
		similarItems = similarItems.concat(
			similarIndices.map(([index, similarity]) => ({
				...dfItems.at(index),
				similarity
			}))
		);
	}
	return similarItems;
}

export { cosineSimilarityManual, findSimilarItems, findMatchingItemsWithRag, getEmbeddings }
