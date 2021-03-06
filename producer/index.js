const express = require("express");
const { v4 } = require("uuid");
const Kafka = require("node-rdkafka");
const eventMessageSchemaSerialize = require("../messageSchema");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.disable("x-powered-by");

//kafka write stream
const kafkaWriteStream = Kafka.createWriteStream(
  { "metadata.broker.list": "localhost: 9092" },
  {},
  { topic: "test" }
);

//POST request
app.post("/subscribe-newsletter", async (req, res) => {
  try {
    let response;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let hobbies = req.body.hobbies;
    let messageId = v4();
    let message = await queueMessage(name, age, gender, hobbies, messageId);
    if (message.success)
      response = await axios.get(`http://localhost:4000/${messageId}`);

    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(501).send({ success: false, message: error.message });
  }
});

//This function attempts to add the message to the queue in kafka and returns a promise
async function queueMessage(
  name = "",
  age = 18,
  gender = "",
  hobbies = [],
  messageId = ""
) {
  return new Promise((resolve, reject) => {
    try {
      let result = false;
      let message = {
        name: name,
        age: age,
        gender: gender,
        hobbies: hobbies,
        messageId: messageId,
      };
      result = kafkaWriteStream.write(
        eventMessageSchemaSerialize.toBuffer(message)
      );
      if (result) {
        console.log(`event created ----> ${JSON.stringify(message, null, 2)}`);
        resolve({ success: true, data: message });
      }
      if (!result)
        reject({ success: false, message: "Unable to create event !" });
    } catch (error) {
      console.log(error);
      reject({ success: false, message: error.message });
    }
  });
}

app.listen(3000, (err) => {
  if (!err) {
    console.log("**********PRODUCER*************");
  }
});
