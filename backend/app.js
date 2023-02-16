// import express
const express = require("express");
// initiate server
const app = express();
// import bcrypt functions
const bcryptFunctions = require("./bcrypt");
console.log(bcryptFunctions);
// så vi kan läsa och skriva data till json-fil
const fs = require("fs");

app.use(express.json());

// signup
app.post("/signup", async (req, res) => {
  let credentials = {
    userName: req.body.userName,
    password: req.body.password,
    admin: req.body.admin,
  };
  const hashedPassword = await bcryptFunctions.hashPassword(
    credentials.password
  );
  credentials.password = hashedPassword;
  credentials.loggedIn = true;
  // skriva in nya användaren i vår users.json-fil
  let usersData = fs.readFileSync("users.json");
  // göra om datan vi läst in till javascript-objekt
  let usersObject = JSON.parse(usersData);
  // pusha in nya användaren till users-listan
  usersObject.users.push(credentials);
  // göra om det till JSON igen
  usersObject = JSON.stringify(usersObject);
  // uppdatera filen
  fs.writeFile("users.json", usersObject, (err) => {
    if (err) {
      console.log("det blev fel");
    }
  });
  res.send("gick ok");
});

// login
app.post("/login", (req, res) => {
  let credentials = {
    userName: req.body.userName,
    password: req.body.password,
    admin: req.body.admin,
  };
  let users = fs.readFileSync("users.json");
  users = JSON.parse(users);
  // finns användarnamnet?
  let userIndex = users.users.findIndex(
    (user) => user.userName === credentials.userName
  );
  let user;
  if (userIndex >= 0) {
    // då har den ett index i arrayen
    user = users.users[userIndex];
    // användarnamnet finns!
    console.log(user);
    // {"userName":"yohanna","password":"$2b$10$xbr7f32JYLaOK22b3/MLSevv8vAvMYXgi9O.VwiWORJDjhTE895QG","admin":true,"loggedIn":true

    // nu vill vi kolla så att lösenordet är korrekt
    let passwordMatched = bcryptFunctions.comparePassword(
      credentials.password,
      user.password
    );

    if (passwordMatched) {
      // lösenordet stämde
      // uppdatera vår json och meddela den att vi är inloggade
      users.users[userIndex].loggedIn = true;
      users = JSON.stringify(users);
      // uppdatera filen users.json
      fs.writeFile("users.json", users, (err) => {
        if (err) {
          console.log("det blev fel");
        }
      });
    } else {
      console.log("fel lösenord");
    }
  } else {
    console.log("this username does not exist");
  }
});

// logout
app.post("/logout", (req, res) => {
  let credentials = {
    userName: req.body.userName,
  };
  // ta in users från users.json
  let users = fs.readFileSync("users.json");

  // omvandla till js
  users = JSON.parse(users);

  // hitta användarnamnet som matchar i users.json
  let userIndex = users.users.findIndex(
    (user) => user.userName === credentials.userName
  );
  // uppdatera users.loggedIn till false
  users.users[userIndex].loggedIn = false;
  // göra om objektet med alla användare till json igen
  users = JSON.stringify(users);
  // uppdatera users.json
  fs.writeFile("users.json", users, (error) => {
    console.log(error);
  });
});

// handle products
app.get("/", (req, res) => {
  res.send(products);
});

// en route handler för när vi hanterar en delete-metod på endpointen '/'
app.delete("/", (req, res) => {
  // logik för att ta bort vald produkt
  let productId = req.body.productId;
  // spara kopia på products för att sedan manipulera den
  let updatedProducts = products;
  //hitta indexet för produkten som skall bort
  let id = updatedProducts.products.findIndex(
    (product) => product.id == productId
  );
  // filtrera ut vald produkt från listan
  updatedProducts.products.splice(id, 1);
  // uppdatera datan i vår data.json-fil
  fs.writeFile(
    "./static/data.json",
    JSON.stringify(updatedProducts, null, 2),
    (err) => {
      if (err) {
        console.log(err);
        // logik för att hantera fel ex. returnera 404-sida
        res.send("404");
      } else {
        // skicka tillbaka svar för att meddela användare att det gick bra
        res.send(updatedProducts);
      }
    }
  );
});

app.put("/", (req, res) => {
  console.log(req.body);
  // req: { productId: 1, product: { title: 'new title', price: 32 } };

  // hitta reda på objektet i json som matchar id
  let productId = req.body.productId;
  let index = products.products.findIndex((product) => product.id == productId);
  let product = products.products[index];
  // sedan justera objektet
  product.title = req.body.product.title;
  product.price = req.body.product.price;
  console.log(product);
  // byt ut gmla produkten med uppdaterade produkten i listan
  products.products.splice(index, 1, product);
  // uppdatera vår data.json-fil med vår nya fina data
  fs.writeFile(
    "./static/data.json",
    JSON.stringify(products, null, 2),
    (err) => {
      if (err) {
        console.log("error");
      } else {
        res.send(products);
      }
    }
  );
});

//när vi vill lägga till en ny produkt
app.post("/", (req, res) => {
  let newProduct = req.body;
  // generera unikt id till den nya produkten
  newProduct.id = products.products.length + 1;
  console.log(newProduct);
  // lägga till produkten bland de andra produkterna i listan
  products.products.push(newProduct);

  fs.writeFile(
    "./static/data.json",
    JSON.stringify(products, null, 2),
    (err) => {
      if (err) {
        res.send("här blev det fel");
      } else {
        res.send("topp");
      }
    }
  );
});

app.listen(5552, () => {
  console.log("app is running on server 5552");
});
