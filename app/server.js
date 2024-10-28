import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { getClothRecommendations } from './lib/rag.js';
import { __dirname } from './dirname.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('www'));

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
		const realPath = path.join(__dirname, 'public', product.thumbnail);
		const recommendationResults = await getClothRecommendations(realPath);

		// Ensure recommendations is always an array
		const recommendations = Array.isArray(recommendationResults)
			? recommendationResults
			: [recommendationResults];

		const response = {
			recommendations, // Now guaranteed to be an array
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