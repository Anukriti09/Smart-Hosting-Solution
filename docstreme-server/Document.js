const { Schema, model } = require("mongoose")

const Document = new Schema({
  _id: String,
  data: Object,
  updates: Array,
})

module.exports = model("Document", Document)