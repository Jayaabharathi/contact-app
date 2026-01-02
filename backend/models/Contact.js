const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, "Phone must be 10 digits starting with 6-9"]
  },
  message: { type: String }
});

module.exports = mongoose.model("Contact", ContactSchema);
