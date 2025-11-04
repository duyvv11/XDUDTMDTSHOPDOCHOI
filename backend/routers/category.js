const express = require('express');
const router = express.Router();
const Category = require('../models/Categories');

// get all
router.get('/ ', async (req, res) => {
  const category = await Category.find();
  res.json(category);

})
//get by id 
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  res.json(category);
}
)