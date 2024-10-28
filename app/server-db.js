import express from 'express';

/**
import griddb from './db/griddb.js';
import store from './db/griddbClient.js';
import { getOrCreateContainer, insertData, queryData, queryDataById } from './db/griddbOperations.js';
*/

import { getClothRecommendations } from './lib/rag.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('www'));

/** 
const containerName = 'myContainer';
const columnInfoList = [
	['id', griddb.Type.INTEGER],
	['image', griddb.Type.STRING],
	['data', griddb.Type.STRING]
];
*/

// serve the main UI
app.get('/', async (req, res) => {
	res.sendFile('index.html')
});

app.post('/recommendation', async (req, res) => {
	const { selectedProduct } = req.body;

	try {
		const response = await getClothRecommendations(selectedProduct.image);
		console.log(response)

		//const container = await getOrCreateContainer(containerName, columnInfoList);
		//await insertData(container, [parseInt(id, 10), imagePath]);
		res.status(201).json({ recommendation: response });
	} catch (err) {
		console.error('Error in /upload:', err.message);
		res.status(500).json({ error: 'Failed to get the clothes recommendation' });
	}
});

/** disable for non-db testing
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

*/

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
