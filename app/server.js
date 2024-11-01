import express from 'express';
import path from 'path';
import { getClothRecommendations } from './lib/rag.js';
import { __dirname } from './dirname.js';
import { generateRandomID } from './lib/rangen.js';
import griddb from './db/griddb.js';
import store from './db/griddbClient.js';
import { getOrCreateContainer, insertData, queryData, queryDataById } from './db/griddbOperations.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('www'));

const containerName = 'myContainer';
const columnInfoList = [
	['id', griddb.Type.INTEGER],
	['image', griddb.Type.STRING],
	['recommendations', griddb.Type.STRING]
];

app.get('/', async (req, res) => {
	res.sendFile('index.html');
});

app.post('/recommendation', async (req, res) => {
	const { product } = req.body;

	if (!product) {
		return res.status(400).json({
			error: 'Missing product data',
			details: 'Request body must include a product object'
		});
	}

	try {
		const realImagePath = path.join(__dirname, 'public', product.thumbnail);
		const recommendationResults = await getClothRecommendations(realImagePath);

		// Ensure recommendations is always an array
		const recommendations = Array.isArray(recommendationResults)
			? recommendationResults
			: [recommendationResults];

		const cleanRecommendations = recommendations.map(({ embeddings, ...rest }) => rest);


		const container = await getOrCreateContainer(containerName, columnInfoList);
		await insertData(container, [generateRandomID(), product.image, JSON.stringify(cleanRecommendations)]);

		const response = {
			recommendations,
			metadata: {
				processedAt: new Date().toISOString(),
				totalResults: recommendations.length,
				category: product.category,
				algorithmVersion: '1.0.0',
				basedOn: {
					productId: product.id,
					productName: product.name,
				}
			}
		};

		res.status(200).json(response);
	} catch (err) {
		console.error('Error in /recommendation:', err.message);
		res.status(500).json({
			error: 'Failed to get the clothes recommendation',
			details: err.message
		});
	}
});

app.get('/query', async (req, res) => {
	try {
		const container = await store.getContainer(containerName);
		const result = await queryData(container);
		res.status(200).json({ data: result });
	} catch (err) {
		console.error('Error in /query:', err.message);
		res.status(500).json({ error: 'Failed to query data' });
	}
});

app.get('/query/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const container = await store.getContainer(containerName);
		const result = await queryDataById(id, container, store);
		if (result.length > 0) {
			res.status(200).json({ data: result });
		} else {
			res.status(404).json({ message: 'Data not found' });
		}
	} catch (err) {
		console.error('Error in /query/:id:', err.message);
		res.status(500).json({ error: 'Failed to query data by ID' });
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		error: 'Something broke!',
		details: err.message
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;