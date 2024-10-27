import express from 'express';
import { existsSync } from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Mock recommendation data
const mockRecommendations = {
	// Sports Wear recommendations
	sportsWear: [
		{
			id: 'sr1',
			name: 'Sports Shorts Nike Pro',
			price: 29.99,
			category: 'Sports Wear',
			image: '/data/preview/sports-shorts-nike.png',
			confidence: 0.89
		},
		{
			id: 'sr2',
			name: 'Performance Socks Pack',
			price: 12.99,
			category: 'Sports Wear',
			image: '/data/preview/performance-socks.png',
			confidence: 0.85
		},
		{
			id: 'sr3',
			name: 'Sports Cap',
			price: 19.99,
			category: 'Accessories',
			image: '/data/preview/sports-cap.png',
			confidence: 0.82
		}
	],

	// Casual Wear recommendations
	casualWear: [
		{
			id: 'cr1',
			name: 'Casual Denim Shorts',
			price: 34.99,
			category: 'Casual Wear',
			image: '/data/preview/casual-shorts.png',
			confidence: 0.91
		},
		{
			id: 'cr2',
			name: 'Summer Skirt Floral',
			price: 39.99,
			category: 'Casual Wear',
			image: '/data/preview/summer-skirt.png',
			confidence: 0.87
		},
		{
			id: 'cr3',
			name: 'Canvas Sneakers',
			price: 44.99,
			category: 'Footwear',
			image: '/data/preview/canvas-sneakers.png',
			confidence: 0.84
		}
	],

	// Formal Wear recommendations
	formalWear: [
		{
			id: 'fr1',
			name: 'Formal Trousers Classic',
			price: 69.99,
			category: 'Formal Wear',
			image: '/data/preview/formal-trouser.png',
			confidence: 0.93
		},
		{
			id: 'fr2',
			name: 'Silk Tie Striped',
			price: 29.99,
			category: 'Accessories',
			image: '/data/preview/silk-tie.png',
			confidence: 0.88
		},
		{
			id: 'fr3',
			name: 'Leather Belt',
			price: 49.99,
			category: 'Accessories',
			image: '/data/preview/leather-belt.png',
			confidence: 0.86
		}
	]
};

// Helper function to check if image exists
const imageExists = (imagePath) => {
	// Remove leading '/' if present
	const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
	// Check if file exists in the specified path
	return existsSync(path.join(process.cwd(), 'www', cleanPath));
};

// Helper function to filter recommendations based on image existence
const filterRecommendations = (recommendations) => {
	return recommendations.filter(item => {
		const imageExistsFlag = imageExists(item.image);
		if (!imageExistsFlag) {
			console.log(`Image not found: ${item.image} for item: ${item.name}`);
		}
		return imageExistsFlag;
	});
};

// Helper function to get recommendations based on product category
const getRecommendationsByCategory = (category) => {
	let recommendations;

	switch (category.toLowerCase()) {
		case 'sports wear':
			recommendations = mockRecommendations.sportsWear;
			break;
		case 'casual wear':
			recommendations = mockRecommendations.casualWear;
			break;
		case 'formal wear':
			recommendations = mockRecommendations.formalWear;
			break;
		default:
			// Return mixed recommendations if category doesn't match
			recommendations = [
				...mockRecommendations.sportsWear.slice(0, 1),
				...mockRecommendations.casualWear.slice(0, 1),
				...mockRecommendations.formalWear.slice(0, 1)
			];
	}

	// Filter out recommendations with non-existent images
	return filterRecommendations(recommendations);
};

// Simulate network delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

app.use(express.json());
app.use(express.static('www'));

// Serve the main UI
app.get('/', async (req, res) => {
	res.sendFile('index.html');
});

// Updated recommendation endpoint
app.get('/recommendation', async (req, res) => {
	const categoryId = req.query.categoryId;

	try {
		// Simulate API delay
		await simulateDelay();

		const recommendations = getRecommendationsByCategory(categoryId);

		console.log(recommendations)

		// Simulate RAG response structure
		const response = {
			recommendations,
			metadata: {
				processedAt: new Date().toISOString(),
				totalResults: recommendations.length,
				category: categoryId,
				algorithmVersion: '1.0.0'
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