const avro = require("avsc");

module.exports = avro.Type.forSchema({
  type: "record",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "age",
      type: "int",
    },
    {
      name: "gender",
      type: "string",
    },
    {
      name: "hobbies",
      type: { type: "array", items: "string" },
    },
    {
      name: "messageId",
      type: "string",
    },
  ],
});
