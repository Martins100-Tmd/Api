const express = require("express");
const { sequelize } = require("./database");
require("colors");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { User, Message } = require("./database");

sequelize.sync().then(() => console.log("Database is Ready!!!".green));
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb" }));

//Normal welcome route
app.get("/", async (req, res) => {
  let users = await User.findAll();
  res.status(200).json({ message: "Hello World", users });
});
//Get all users route
app.get("/users", async (req, res) => {
  const all = await User.findAll({
    attributes: ["name", "map"],
  });
  res.status(200).json({ users: all });
});

//Get my account route
app.post("/me", async (req, res) => {
  const { password } = req.body;
  const FindMe = await User.findOne({
    where: {
      password,
    },
  });
  if (FindMe) {
    res.status(200).json({ me: FindMe });
  } else {
    res.status(400).json({ message: "User doesn't exist" });
  }
});

//Create Account route
app.post("/create", (req, res) => {
  if ((req.body.name, req.body.password)) {
    const rand = Math.random().toString(16).substring(2, 8); // 6de5ccda
    req.body["map"] = rand;
    User.create(req.body).then(() => {
      console.log("User Created!!!".yellow);
    });
    res.status(200).json({ message: "User Created", me: req.body.password });
  }
});

//get My messages
app.get("/me/:map", async (req, res) => {
  const { map } = req.params;
  const FindMe = await User.findOne({
    where: {
      map,
    },
  });
  if (FindMe) {
    res.status(200).json({ me: FindMe });
  } else {
    res.status(400).json({ message: "User doesn't exist" });
  }
});

//get all couple user messages
app.get("/msg/all/:map/:map1", async (req, res) => {
  const { map, map1 } = req.params;
  const firstSender = await Message.findAll({
    where: {
      senderMap: map,
      receiverMap: map1,
    },
  });
  const secondSender = await Message.findAll({
    where: {
      senderMap: map1,
      receiverMap: map,
    },
  });
  let allMessages = [...firstSender, ...secondSender];
  allMessages = allMessages.filter((item) => item !== undefined);
  res.status(200).json({ all: allMessages });
});

//send a message to this route
app.post("/msg", (req, res) => {
  const { text, from, to, receiverMap, senderMap } = req.body;
  if (text && from && to && receiverMap && senderMap) {
    req.body["date"] = new Date().getSeconds();
    Message.create(req.body).then(() => {
      console.log(`${from} sent a message`.blue);
    });
    res.status(200).json({ message: `${from} sent a message` });
  } else {
    res.status(200).json({ message: "Blank field" });
  }
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
