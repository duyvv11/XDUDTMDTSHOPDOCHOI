const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');

// get all
router.get('/', async (req, res) => {
  const brand = await Brand.find();
  res.json(brand);

});
// get by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const brand = await Brand.findById(id);
  res.json(brand);
})
module.exports = router; 