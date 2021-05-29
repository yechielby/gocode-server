const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", (req, res) => {
  fs.readFile("products.json", "utf8", (err, text) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      const { title } = req.query;
      productArr = JSON.parse(text);
      if (title) {
        res.send(
          productArr.filter((item) =>
            item.title.toLowerCase().includes(title.toLowerCase()),
          ),
        );
      } else {
        res.send(productArr);
      }
    }
  });
});

app.get("/products/:id", (req, res) => {
  fs.readFile("products.json", "utf8", (err, text) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      productArr = JSON.parse(text);
      product = productArr.find((item) => item.id === +req.params.id);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send();
      }
    }
  });
});

app.post("/products", (req, res) => {
  fs.readFile("products.json", "utf8", (err, text) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      productArr = JSON.parse(text);
      newProduct = {
        id: Math.max(...productArr.map((item) => item.id)) + 1,
        title: req.body.title,
        price: req.body.parse,
        description: req.body.description,
        category: req.body.category,
        image: req.body.image,
      };
      productArr.push(newProduct);
      fs.writeFile("products.json", JSON.stringify(productArr), (err) => {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          res.send(newProduct);
        }
      });
    }
  });
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, description, category, image } = req.body;
  fs.readFile("products.json", "utf8", (err, text) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      productArr = JSON.parse(text);
      NewProductArr = productArr.map((product) => {
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

      fs.writeFile("products.json", JSON.stringify(NewProductArr), (err) => {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          res.send(`{"data": "update successfully"}`);
        }
      });
    }
  });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("products.json", "utf8", (err, text) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      productArr = JSON.parse(text);
      NewProductArr = productArr.filter((item) => item.id !== +id);

      fs.writeFile("products.json", JSON.stringify(NewProductArr), (err) => {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          res.send(`{"data": "delete successfully"}`);
        }
      });
    }
  });
});

app.listen(8000);
