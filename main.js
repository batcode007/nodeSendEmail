const test = require("./handler.js");

const event = {
  userActivity: "1",
  fileData: {
    "Company": "ABC",
    "Team": "JsonNode",
    "Number of members": 4,
    "Time to finish": "1 day"
  },
  userEmail: "user@gmail.com"
};

console.log('lets test it', test.handler(event));