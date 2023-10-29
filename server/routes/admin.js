const express =require("express");
const adminRouter = express.Router();

const admin =require("../middlewares/admin");
const { product } =require("../models/product");
const { Order } =require("../models/order");
const { PromiseProvider } = require("mongoose");

// admin add product to the database

adminRouter.post("/admin/add-product", admin, async (req, res) =>{
    try {
        const {name, description, images, quantity, price, category } = req.body;
        let product =new product({
            name,
            description,
            images,
            quantity,
            price,
            category
        });
        product =await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error:e.message});
    }
});

// admin get all products
adminRouter.get("/admin/get-products", admin, async (req, res) => {
    try {
         const products = await product.find({});
         res.json(products); 
    } catch (e) {
         res.status(500).json({error: e.message});
    }
});

// admin delete the product

adminRouter.post("/admin/delte-product", admin, async (req, res) =>{
  try {
      const { id } =req.body;
      let product =await product.findByIdAndDelete(id);
      res.json(product);
  } catch (e) {
     res.status(500).json({error:e.message});
  }
});

// admin see all orders
adminRouter.get("/admin/get-orders", admin, async (req, res) => {
    try {
        const orders =await order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: e.message});
    }
});
// admin change order status

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
    try {
        const { id, status } =req.body;
        let order = await Order.findById(id);
         order.status=status;
         order =await order.save();
         res.json(order);
    } catch (e) {
       res.status(500).json({ error: e.message}); 
    }
});

// Analytics

adminRouter.get("/admin/analytics", admin, async (req, res) => {
   try { 
     const orders =await Order.find({});
    let totalEarnings =0;


    for (let i=0; i< orders.length; i++) {
      for (let j=0; j< orders[i].products.length; j++) {
        totalEarnings += 
          orders[i].products[j].quantity * orders[i].products[i].product.price;

      }
    }
    // Category wish order fetching 
    let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
    let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
    let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
    let booksEarnings = await fetchCategoryWiseProduct("Books");
    let fashionEarnings = await fetchCategoryWiseProduct("Fashion");
 let earings ={
     totalEarnings,
      mobileEarnings,
      essentialEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings,
 };
      res.json(earings);
}  catch (e) {
    res.status(500).json({ error: e.message});
}
});


async function fetchCategoryWiseProduct(category) {
    let earings =0;
    let categoryOrders = await  Order.find({
        "products.product.category": category,
    });
    for( let i=0; i< categoryOrders.length; i++) {
        for (let j=0; j<categoryOrders[i].products.length; J++) {
            earnings += 
            categoryOrders[i].products[j].quantity *
            categoryOrders[i].products[j].product.price;
        }
    }
    return earings;
}

module.exports =adminRouter;