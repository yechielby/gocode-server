const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

function readProducts(callback, res) {
  fs.readFile("products.json", "utf8", (err, text) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      productArr = JSON.parse(text);
      callback(productArr);
    }
  });
}
function writeProducts(productArr, sendData, res) {
  fs.writeFile("products.json", JSON.stringify(productArr), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.send(sendData);
    }
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", (req, res) => {
  readProducts((products) => {
    const { title } = req.query;
    if (title) {
      res.send(
        products.filter((item) =>
          item.title.toLowerCase().includes(title.toLowerCase()),
        ),
      );
    } else {
      res.send(products);
    }
  }, res);
});

app.get("/products/:id", (req, res) => {
  readProducts((products) => {
    product = products.find((item) => item.id === +req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send();
    }
  }, res);
});

app.post("/products", (req, res) => {
  readProducts((products) => {
    newProduct = {
      id: Math.max(...products.map((item) => item.id)) + 1,
      title: req.body.title,
      price: req.body.parse,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
    };
    products.push(newProduct);
    writeProducts(products, newProduct, res);
  }, res);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, description, category, image } = req.body;
  readProducts((products) => {
    NewProductArr = products.map((product) => {
      if (product.id === +id) {
        return {
          id: product.id,
          title: title ?? product.title,
          price: price ?? product.price,
          description: description ?? product.description,
          category: category ?? product.category,
          image: image ?? product.image,
        };
      } else {
        return product;
      }
    });

    writeProducts(NewProductArr, `{"data": "update successfully"}`, res);
  }, res);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  readProducts((products) => {
    NewProductArr = products.filter((item) => item.id !== +id);
    writeProducts(NewProductArr, `{"data": "delete successfully"}`, res);
  }, res);
});

app.listen(8000);
