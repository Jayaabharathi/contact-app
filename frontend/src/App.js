import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contacts, setContacts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Validation
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) return "Phone must be 10 digits starting with 6-9";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format";
    return "";
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    try {
      const url = editId
        ? `http://localhost:5000/contacts/${editId}`
        : "http://localhost:5000/contacts";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to save contact");

      setForm({ name: "", email: "", phone: "", message: "" });
      setEditId(null);
      setSuccess(editId ? "Contact updated successfully" : "Contact added successfully");
      fetchContacts();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  // Edit contact
  const editContact = (c) => {
    setForm(c);
    setEditId(c._id);
    setError("");
  };

  // Delete contact ✅
  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const res = await fetch(`http://localhost:5000/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete contact");
      fetchContacts();
      setSuccess("Contact deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete contact");
    }
  };
  // Sort contacts by field
const sortContacts = (field) => {
  const sorted = [...contacts].sort((a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  });
  setContacts(sorted);
};


  return (
    <div className="container">
      <div>
        <h2>{editId ? "Edit Contact" : "Add Contact"}</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Phone *"
            value={form.phone}
            maxLength="10"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, phone: value });
            }}
          />
          {form.phone && !/^[6-9]\d{9}$/.test(form.phone) && (
            <p className="error">Phone must be 10 digits starting with 6-9</p>
          )}
          <textarea
            placeholder="Message"
            rows="4"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button disabled={!form.name || !/^[6-9]\d{9}$/.test(form.phone)}>
            {editId ? "Update" : "Submit"}
          </button>
        </form>
      </div>
      


     <div>
  <h2>Contacts</h2>

  {/* Sorting Buttons */}
  <div style={{ marginBottom: "10px" }}>
    <button onClick={() => sortContacts("name")}>Sort by Name</button>
    <button onClick={() => sortContacts("phone")}>Sort by Phone</button>
  </div>

  <div className="list">
    {contacts.map((c) => (
      <div key={c._id} className="card">
        <strong>{c.name}</strong>
        <p>{c.phone}</p>
        {c.email && <p>{c.email}</p>}
        {c.message && <p>{c.message}</p>}
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => editContact(c)}>Edit</button>
          <button onClick={() => deleteContact(c._id)}>Delete</button>
        </div>
      </div>
    ))}
    {contacts.length === 0 && <p>No contacts yet</p>}
  </div>
</div>
</div>
);
}

export default App;

