import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API Up And Running' });
});

export default router;
