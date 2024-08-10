import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API Up And Running' });
});

router.get('/version', (req, res) => {
  res.json({ message: 'version 1.1' });
});

router.get('/failed', (req, res) => {
  res.json({ message: 'CheckOut Failed' });
});

export default router;
