const express = require("express");
const router = express.Router();
const News = require("../models/new");

// get all
router.get("/", async (req, res) => {
  try {
    const news = await News.find().populate("author", "name email");
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    const item = await News.findById(req.params.id).populate("author", "name email");
    if (!item) return res.status(404).json({ message: "Không tìm thấy tin tức" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new
router.post("/", async (req, res) => {
  console.log("nhận");
  try {
    const newNews = new News({
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      imagenew: req.body.imagenew,
    });

    const saved = await newNews.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update new
router.put("/:id", async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          author: req.body.author,
          title: req.body.title,
          content: req.body.content,
          imagenew: req.body.imagenew,
        },
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Tin không tồn tại" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete new
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Tin không tồn tại" });

    res.json({ message: "Xóa thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
