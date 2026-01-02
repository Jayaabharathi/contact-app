export default function ContactList({ contacts, refresh }) {

  const deleteContact = async (id) => {
    await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: "DELETE"
    });
    refresh();
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Phone</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(c => (
          <tr key={c._id}>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>
              <button onClick={()=>deleteContact(c._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
