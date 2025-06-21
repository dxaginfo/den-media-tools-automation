/**
 * Simple web server for LoopOptimizer
 */

const express = require('express');
const bodyParser = require('body-parser');
const LoopOptimizer = require('./loop_optimizer');

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(bodyParser.json({ limit: '50mb' }));

// Serve static files from the public directory
app.use(express.static('public'));

// Initialize the optimizer
const optimizer = new LoopOptimizer({
  quality: 8,
  enableCompression: true,
  // Firebase config would go here in production
});

// API endpoint for optimization
app.post('/api/optimize', async (req, res) => {
  try {
    const { animationData, options } = req.body;
    
    if (!animationData) {
      return res.status(400).json({ error: 'Animation data is required' });
    }
    
    const optimized = await optimizer.optimizeLoop(animationData, options);
    
    res.json({
      success: true,
      data: optimized
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`LoopOptimizer server running on port ${port}`);
});
