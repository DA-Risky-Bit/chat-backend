var express = require('express');
var router = express.Router();

/* GET Healt check. */
router.get('/api/chat/', function(req, res, next) {
  res.json({ message: "Chat-Backend Running"});
});

router.get("/api/chat/sendMsg", async function(req, res, next) {
  if (!req.query.message) {
    res.status = 500;
    res.json({ error: "Missing 'message' query parameter" });
    return;
  }

  const message = req.query.message;

  const history = req.query.history ? JSON.parse(req.query.history) : [];

  console.log("Received message:", message);
  console.log("Received history:", history);

  var constHistory = history.map(([role, content]) => ({
    role: role,
    content: content
  }));

  console.log("Constructed history for Ollama API:", constHistory);

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
        ...constHistory,
        { role: "user", content: message }
      ]
    }),
  });

  const ollamaData = await ollamaResponse.json();

  res.json({ message: "Testing API Endpoint for User to AI Interaction", ollamaData });
});

module.exports = router;
