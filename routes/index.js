var express = require('express');
const { timeStamp, time } = require('node:console');
var router = express.Router();
const fs = require('node:fs');
const path = require('path');

var backendHistory = new Map();

const dms = [
  { "id": 0, "name": "Thomas Berger", "desc": "IT-Security", "status": "online" },
  { "id": 1, "name": "Sabine Gruber", "desc": "Personal", "status": "online" },
  { "id": 2, "name": "Maria Huber", "desc": "PR", "status": "online" }
];

// Debug for TOFT
var thougts = new Map();

/* GET Healt check. */
router.get('/api/chat/', function (req, res, next) {
  res.json({ message: "Chat-Backend Running" });
});

/*

API request handler for handling Local LLM Messaging.

--  Inputs as URL Params
#   Message

History handling through 'backendHistory' variable
*/

router.get("/api/chat/sendMsg", async function (req, res, next) {
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
    role: role === "emil" ? "assistant" : "user",
    content: content
  }));

  var systemPrompt = ""

  try {
    const promptPath = path.join(__dirname, '../prompts/prompt.txt');
    systemPrompt = fs.readFileSync(promptPath, 'utf8');
    console.log(systemPrompt);
  } catch (err) {
    console.error(err);
  }

  backendHistory.set(`you:` + Date.now(), message);

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
        { role: "system", content: systemPrompt },
        ...constHistory,
        { role: "user", content: message }
      ]
    }),
  });

  const ollamaData = await ollamaResponse.json();

  backendHistory.set(`emil:` + Date.now(), ollamaData.message.content);
  thougts.set(`${Date.now()}`, ollamaData.message.thinking);

  console.log(backendHistory);

  res.json({ message: "Testing API Endpoint for User to AI Interaction", ollamaData });
});

router.post("/api/chat/history", function (req, res, next) {
  console.log("HISTORY: " + backendHistory)
  console.log(Array.from(backendHistory.entries()).length)

  if (Array.from(backendHistory.entries()).length > 0) {
    res.json(Array.from(backendHistory.entries()))
  } else {
    res.status(404)
    res.json("no history")
  }
});

router.delete("/api/chat/history", async function (req, res, next) {
  const logPath = path.join(__dirname, `../logs/log${Date.now()}.txt`);
  fs.writeFileSync(logPath, JSON.stringify(Array.from(backendHistory), null, 2) + "\n\r Thoughts: \n\r" + JSON.stringify(Array.from(thougts), null, 2));

  backendHistory = new Map();
  thougts = new Map();

  res.json("history deleted");
});

router.post("/api/chat/dms", function (req, res, next) {
  res.json(dms);
});

router.post("/api/chat/dms/:id", function (req, res, next) {
  const id = req.params.id;

  res.json(dms.at(id));
});

module.exports = router;
