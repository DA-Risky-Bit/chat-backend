var express = require('express');
var router = express.Router();

var backendHistory = new Map();

/* GET Healt check. */
router.get('/api/chat/', function(req, res, next) {
  res.json({ message: "Chat-Backend Running"});
});

/*

API request handler for handling Local LLM Messaging.

--  Inputs as URL Params
#   Message

History handling through 'backendHistory' variable
*/
router.get("/api/chat/sendMsg", async function(req, res, next) {
  if (!req.query.message) {
    res.status = 500;
    res.json({ error: "Missing 'message' query parameter" });
    return;
  }

  const message = req.query.message;

  const history = Array.from(backendHistory.entries()).map(([role, content]) => [role.split(":")[0], content]);

  console.log("Received message:", message);
  console.log("Saved history:", history);

  // Constructed History for AI Messaging
  var constHistory = history.map(([role, content]) => ({
    role: role,
    content: content
  }));

  backendHistory.set(`user:` + Date.now(), message);

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

  backendHistory.set(`assistant:` + Date.now(), ollamaData.message.content);

  console.log(backendHistory);

  res.json({ message: "Testing API Endpoint for User to AI Interaction", ollamaData });
});

module.exports = router;
