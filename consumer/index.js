const express = require("express");
const EventEmitter = require("events");
const Kafka = require("node-rdkafka");
const eventMessageSchemaDeserialize = require("../messageSchema");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.disable("x-powered-by");

//response event emitter
const responseEventEmitter = new EventEmitter();

//create kafka consumer
const consumer = Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": "localhost: 9092",
  },
  {}
);

consumer.connect();

app.get("/:eventId", async (req, res) => {
  responseEventEmitter.on(req.params.eventId, (data) => {
    delete data.messageId;
    data.success = true;
    console.log(
      `sending the response ------> ${JSON.stringify(data, null, 2)}`
    );
    res.json(data);
  });
});

consumer
  .on("ready", () => {
    console.log("Consumer ready....");
    consumer.subscribe(["test"]);
    consumer.consume();
  })
  .on("data", handleReceivedEvents);

function handleReceivedEvents(data) {
  data = eventMessageSchemaDeserialize.fromBuffer(data.value);
  console.log(`received the message ------> ${JSON.stringify(data, null, 2)}`);
  responseEventEmitter.emit(data.messageId, data);
}
app.listen(4000, (err) => {
  if (!err) {
    console.log("**********CONSUMER*************");
  }
});
