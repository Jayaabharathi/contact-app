const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Contact = require("./models/Contact");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB (Mongoose 7+)
mongoose.connect("mongodb://127.0.0.1:27017/contactApp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// GET all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create contact
app.post("/contacts", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE contact ✅
app.delete("/contacts/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
