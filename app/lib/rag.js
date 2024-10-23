import { promises as fs } from 'fs'
import OpenAI from 'openai';
import { DataFrame, fromCSV } from 'data-forge';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

async function analyzeCloth(encodedImage, uniqueCategories) {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini-2024-07-18",
		messages: [
			{
				"role": "user",
				"content": [
					{
						"type": "text",
						"text": `Given an image of an item of clothing, analyze the item and generate a JSON output with the following fields: \"items\", \"category\", and \"gender\". Use your understanding of fashion trends, styles, and gender preferences to provide accurate and relevant suggestions for how to complete the outfit. The items field should be a list of items that would go well with the item in the picture. Each item should represent a title of an item of clothing that contains the style, color, and gender of the item. The category needs to be chosen between the types in this list: ${uniqueCategories}. \nYou have to choose between the genders in this list: [Men, Women, Boys, Girls, Unisex] Do not include the description of the item in the picture.\nExample Input: An image representing a black leather jacket. Example Output: {\"itemsRecommendation\": [\"Fitted White Women's T-shirt\", \"White Canvas Sneakers\", \"Women's Black Skinny Jeans\"], \"category\": \"Jackets\", \"gender\": \"Women\"}\n`
					},
					{
						"type": "image_url",
						"image_url": {
							"url": `data:image/jpeg;base64,${encodedImage}`
						}
					}
				]
			},

		],
		temperature: 1,
		max_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		response_format: {
			"type": "json_object"
		},
	});

	let features = response.choices[0].message.content

	console.log(`openAI response: ${features}`)
	return features
}

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
	let embeddings = response.data.map(data => data.embedding)
	//console.log(`embeddings: ${embeddings}`)
	return embeddings
}

async function getDataItems() {
	const fileContent = await fs.readFile('data/clothes_styles_with_embeddings.csv', 'utf-8')

	const dfItems = await fromCSV(fileContent)
		.transformSeries({
			embeddings: (embeddingStr) => JSON.parse(embeddingStr)
		})
	return dfItems
}

async function findMatchingItemsWithRag(filteredItems, itemDescs) {
	const embeddings = filteredItems.getSeries('embeddings').toArray();

	let similarItems = [];

	for (const desc of itemDescs) {
		const inputEmbedding = await getEmbeddings([desc]);
		const similarIndices = findSimilarItems(inputEmbedding[0], embeddings);

		console.log(`similarIndices: ${similarIndices}`)

		similarItems = similarItems.concat(
			similarIndices.map(([index, similarity]) => {
				const item = filteredItems.at(index);
				if (!item || !item.id || !item.gender) return null;
				return { ...item, similarity };
			}).filter(Boolean)
		);

	}
	return similarItems;
}

async function encodeImageToBase64(imagePath) {
	try {
		const imageBuffer = await fs.readFile(imagePath);
		const base64String = imageBuffer.toString('base64');

		return base64String;
	} catch (error) {
		if (error.code === 'ENOENT') {
			throw new Error(`Image file not found: ${imagePath}`);
		} else if (error.code === 'EISDIR') {
			throw new Error(`Path is a directory, not a file: ${imagePath}`);
		} else if (error.code === 'EACCES') {
			throw new Error(`Permission denied accessing file: ${imagePath}`);
		} else {
			throw new Error(`Error encoding image: ${error.message}`);
		}
	}
}

async function extractRelevantFeatures(image) {
	const imagePath = image || './data/images/2012.jpg'
	const base64Image = await encodeImageToBase64(imagePath)

	console.log(`base64Image: ${base64Image}`)

	const df = await getDataItems()
	const uniqueSubcategories = df.getSeries('articleType').distinct().toArray()

	console.log(`uniqueSubcategories: ${uniqueSubcategories}`)

	const { itemsRecommendation: itemDescs, category: itemCategory, gender: itemGender } = JSON.parse(await analyzeCloth(base64Image, uniqueSubcategories))

	console.log(`itemDesc: ${itemDescs}, category: ${itemCategory}, gender: ${itemGender}`)

	const filteredItems = df
		.where(row => [itemGender, 'Unisex'].includes(row['gender']))
		.where(row => row['articleType'] !== itemCategory)

	console.log(`${filteredItems.count()} Remaining Items`)


	return await findMatchingItemsWithRag(filteredItems, itemDescs)
}



export { cosineSimilarityManual, findSimilarItems, findMatchingItemsWithRag, getEmbeddings, analyzeCloth, extractRelevantFeatures }
