const express = require('express');
const router = express.Router();
const Brand = require('../models/brand.js'); 

router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ msg: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const brand = new Brand(req.body);
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!brand) {
            return res.status(404).json({ msg: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ msg: 'Brand not found' });
        }
        res.status(200).json({ msg: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;