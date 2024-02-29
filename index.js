const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//models
const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected to db!");
    app.listen(5000, () => console.log("Server Up and running"));
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
//view and config
app.set("view engine", "ejs");
//urls
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({}).exec();
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});
//update
app
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const tasks = await TodoTask.find({});
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  })
  .post(async (req, res) => {
    try {
      const id = req.params.id;
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findOneAndDelete({ _id: id });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
// app.listen(3000, () => console.log("Server Up and running"));

// const express = require("express");
// const app = express();
// const port = 3000;

// // Serve static files from the 'public' directory
// app.use(express.static("public"));

// // Your routes and other middleware...

// app.get("/", (req, res) => {
//   res.render("todo.ejs"); // This will render your EJS template
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
