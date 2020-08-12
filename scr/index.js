const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(cors());
app.use(express.json());

const programadores = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateScrapId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: `Param sent id not a valid UUID` });
  }

  return next();
}

app.use(logRequests);
app.use("/programadores/:id", validateScrapId);

app.get("/programadores", (request, response) => {
  const { title } = request.query;

  const results = title
    ? programadores.filter((scrap) =>
        scrap.title.toLowerCase().includes(title.toLowerCase())
      )
    : programadores;

  return response.json(results);
});

app.post("/programadores", (request, response) => {
  const { title, message } = request.body;

  const scrap = { id: uuid(), title, message };

  programadores.push(scrap);

  return response.json(scrap);
});

app.put("/programadores/:id", (request, response) => {
  const { id } = request.params;
  const { title, message } = request.body;

  const scrapIndex = programadores.findIndex((scrap) => scrap.id === id);

  if (scrapIndex < 0) {
    return response.status(400).json({ error: "scrap not found." });
  }

  const scrap = {
    id,
    title,
    message,
  };

  programadores[scrapIndex] = scrap;

  return response.json(scrap);
});

app.delete("/programadores/:id", (request, response) => {
  const { id } = request.params;

  const scrapIndex = programadores.findIndex((scrap) => scrap.id === id);

  if (scrapIndex < 0) {
    return response.status(400).json({ error: "scrap not found." });
  }

  programadores.splice(scrapIndex, 1);

  return response.status(204).send();
});

const port = 3333;
app.listen(port, () => {
  console.log(`🚀 Server up and running on PORT ${port}`);
});
