const express = require("express");

// const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const programadores = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateProgram(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: `Param sent id not a valid UUID` });
  }

  return next();
}

app.use(logRequests);
app.use("/programadores/:id", validateProgram);

app.get("/programadores", (request, response) => {
  const { title } = request.query;

  const results = title
    ? programadores.filter((programador) =>
        programador.title.toLowerCase().includes(title.toLowerCase())
      )
    : programadores;

  return response.json(results);
});

app.post("/programadores", (request, response) => {
  const { title, message } = request.body;

  const programador = { id: uuid(), title, message };

  programadores.push(programador);

  return response.json(programador);
});

app.put("/programadores/:id", (request, response) => {
  const { id } = request.params;
  const { title, message } = request.body;

  const programadorIndex = programadores.findIndex(
    (programador) => programador.id === id
  );

  if (programadorIndex < 0) {
    return response.status(400).json({ error: "programador not found." });
  }

  const programador = {
    id,
    title,
    message,
  };

  programadores[programadorIndex] = programador;

  return response.json(programador);
});

app.delete("/programadores/:id", (request, response) => {
  const { id } = request.params;

  const programadorIndex = programadores.findIndex(
    (programador) => programador.id === id
  );

  if (programadorIndex < 0) {
    return response.status(400).json({ error: "programador not found." });
  }

  programadores.splice(programadorIndex, 1);

  return response.status(204).send();
});

const port = 3333;
app.listen(port, () => {
  console.log(`🚀 Server up and running on PORT ${port}`);
});
