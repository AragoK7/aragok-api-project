const express = require("express");
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3000;
const app = express();

// api for meals
// "https://www.themealdb.com/api/json/v1/1/random.php"

const { dbConnection } = require("./database.js");

dbConnection.connect((err) => {
  if (!err) {
    console.log("Successfully connected to database");
  } else {
    throw err;
  }
});

app.use(express.static("public"));
app.use(express.json());

app.get("/api/:page", async (request, response) => {
  const skip =
    Number(request.params.page) > 0
      ? (Number(request.params.page) - 1) * 10
      : 0;
  const resultData = await dbConnection
    .promise()
    .query("SELECT sql_calc_found_rows * FROM names_meals LIMIT ?, 10", [skip]);
  const list = resultData[0];
  const resultCount = await dbConnection
    .promise()
    .query("SELECT found_rows() AS count;", [0]);
  const count = resultCount[0][0].count;
  const size = Math.ceil(count / 10);
  console.log("count:", count);
  response.json({ list, count, size });
});

app.post("/name", async (request, response) => {
  const { name } = request.body;
  if (!name) return;
  try {
    const fetchResponse = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await fetchResponse.json();
    const food = data.meals[0].strMeal;
    console.log(food);
    const result = await dbConnection
      .promise()
      .query("INSERT INTO names_meals (username, meal) VALUES(?, ?)", [
        name,
        food,
      ]);
    response.json("should be good");
  } catch (err) {
    response.json("error");
    response.json(err.message);
  }
});

app.listen(PORT, () => console.log(`...Server running on port ${PORT}`));
