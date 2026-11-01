var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: "Hello World"});
});

router.get("/sendMsg", async function(req, res, next) {
  if (!req.query.message) {
    res.status = 500;
    res.json({ error: "Missing 'message' query parameter" });
    return;
  }

  const message = req.query.message;

  const ollamaResponse = await fetch("http://ollama:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen3:4b",
      stream: false,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ]
    }),
  });

  const ollamaData = await ollamaResponse.json();

  res.json({ message: "Testing API Endpoint for User to AI Interaction", ollamaData });
});

module.exports = router;
