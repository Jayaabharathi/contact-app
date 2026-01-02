import { useState } from "react";

export default function ContactForm({ refresh }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  const [error, setError] = useState("");

  const isValid = form.name && form.phone && 
    (!form.email || /\S+@\S+\.\S+/.test(form.email));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    await fetch("http://localhost:5000/api/contacts", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name:"", email:"", phone:"", message:"" });
    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={form.name}
        onChange={e=>setForm({...form, name:e.target.value})} />
      <input placeholder="Email" value={form.email}
        onChange={e=>setForm({...form, email:e.target.value})} />
      <input placeholder="Phone" value={form.phone}
        onChange={e=>setForm({...form, phone:e.target.value})} />
      <textarea placeholder="Message" value={form.message}
        onChange={e=>setForm({...form, message:e.target.value})} />

      {!isValid && <p style={{color:"red"}}>Fill required fields correctly</p>}
      <button disabled={!isValid}>Submit</button>
    </form>
  );
}
