const express = require("express");
const app = express();

const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT;
const mongoose = require("mongoose");
// const Product = require('./models/products')
// require("./.env")
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/datashop', {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
connectDB();
// require model 
// require('./models/brand')
// require('./models/products')
// require('./models/Categories')
// require('./models/Users')
// require('./models/cart')
// require('./models/new')


// import routers
const productRoute = require('./routers/product')
app.use('/api/product', productRoute);
const brandRoute = require('./routers/brand');
app.use('/api/brand', brandRoute);
const categoryRoute = require('./routers/category');
app.use('/api/category', categoryRoute);
const userRoute = require('./routers/user');
app.use('/api/user', userRoute);
const cartRoutes = require('./routers/cart');
app.use('/api/cart',cartRoutes);
const oderRoute = require('./routers/order');
app.use('/api/order',oderRoute);
const newRoutes = require('./routers/news');
app.use('/api/new',newRoutes);


app.listen(port, () => {
  console.log(`sever run on ${port}`);
});