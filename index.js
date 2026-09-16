import express from "express";
import { Product, connectDB } from "./db.js";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to My Restful API using Sequelize");
});
//Create new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const numericPrice = Number(price);
    if (
      !name ||
      price === undefined ||
      price === null ||
      !Number.isFinite(numericPrice)
    ) {
      return res
        .status(400)
        .json({
          message:
            "Name and Price are required fields, and Price must be a number.",
        });
    }
    const newProduct = await Product.create({
      name: name.trim(),
      price: numericPrice,
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({ error: error.message });
  }
});

//Get all product
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Get By Id
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Name and Price are required!!" });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Update product by product ID
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Name and Price are required!!" });
    }

    const { name, price } = req.body;
    const numericPrice = price === undefined ? undefined : Number(price);
    if (!name && price === undefined) {
      return res
        .status(400)
        .json({ message: "Name and Price are required fields!!" });
    }
    if (price !== undefined && !Number.isFinite(numericPrice)) {
      return res.status(400).json({ message: "Price must be a number." });
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update({
      name: name === undefined ? product.name : name.trim(),
      price: price === undefined ? product.price : numericPrice,
    });
    console.log(product);

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

//delete product by id
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Name and Price are required!!" });
  }
  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.destroy();
  return res.status(200).json({
    message: "Product is deleted successfully",
    deletedProducts: product,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
