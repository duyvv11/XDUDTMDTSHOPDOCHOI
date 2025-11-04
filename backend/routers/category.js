const express = require('express');
const router = express.Router();
const Categories = require('../models/Categories');


router.get('/', async (req, res) => {
  try {
    const categories = await Categories.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const category = new Categories(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Categories.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Categories.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(200).json({ msg: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
