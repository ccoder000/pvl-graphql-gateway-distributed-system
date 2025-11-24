import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache()
});

const GET_ALL = gql`
  query {
    users { id name email }
    products { id name price }
  }
`;

const CREATE_USER = gql`
  mutation($name: String!, $email: String!) {
    createUser(name: $name, email: $email) { id name email }
  }
`;

const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id)
  }
`;

function App() {

  const [data, setData] = useState({ users: [], products: [] });
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const load = () => {
    client.query({ query: GET_ALL, fetchPolicy: "no-cache" })
      .then(res => setData(res.data));
  };

  useEffect(() => { load(); }, []);

  const createUser = async () => {
    await client.mutate({
      mutation: CREATE_USER,
      variables: newUser
    });
    setNewUser({ name: "", email: "" });
    load();
  };

  const deleteUser = async (id) => {
    await client.mutate({
      mutation: DELETE_USER,
      variables: { id }
    });
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Users</h1>

      <input placeholder="Name" value={newUser.name}
        onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
      <input placeholder="Email" value={newUser.email}
        onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
      
      <button onClick={createUser}>Add User</button>

      <ul>
        {data.users.map(u => (
          <li key={u.id}>
            {u.name} - {u.email}
            <button onClick={() => deleteUser(u.id)}>X</button>
          </li>
        ))}
      </ul>

      <h1>Products</h1>
      <ul>
        {data.products.map(p => (
          <li key={p.id}>
            {p.name} — ${p.price}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;