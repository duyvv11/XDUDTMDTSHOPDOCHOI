const mongooose = require("mongoose");
const router = mongooose.Router();
const Order = require("../models/order")

// get all 
router.get('/', async (req, rés) => {
  const order = await Order.find();
  res.json(order);

})
// get by user

// get by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  res.json(order);
})