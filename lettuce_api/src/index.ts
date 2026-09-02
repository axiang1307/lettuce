 // src/index.ts
 import express from 'express';

 // 1. Create the Express instance
 const app = express();
 const PORT = 3000;

 // 2. Register a route
 app.get('/', (req, res) => {
   res.send('Hello World');
 });

 // (optional but conventional) health check
 app.get('/health', (req, res) => {
   res.json({ status: 'ok' });
 });

 // 3. Start listening
 app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
 });