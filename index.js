const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
const PORT = process.env.PORT || 4000;
const mongo = process.env.MONGODB_URL;

mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful"))
  .catch(() => console.log("MongoDB connection failed"));

app.get("/api", (req, res) => {
  res.send("server is running");
});

const schemaProducts = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  specification: String,
  shopOwner: String,
  rating: Number,
});
const productModels = mongoose.model("products", schemaProducts);

app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = await productModels(req.body);
  const datasave = await data.save();
  console.log(datasave);

  res.send({ message: "Upload successfully" });
});
app.get("/products", async (req, res) => {
  const data = await productModels.find({});
  res.send(JSON.stringify(data));
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModels.findOne({ _id: productId }).exec();

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log("server is running at port : " + PORT));
