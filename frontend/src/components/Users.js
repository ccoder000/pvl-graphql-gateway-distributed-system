import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export default function Users() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleCreate = async () => {
    if (!name || !email) return;
    await createUser({ variables: { name, email } });
    setName("");
    setEmail("");
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteUser({ variables: { id } });
    refetch();
  };

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography>Error loading users</Typography>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mr: 1 }}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mr: 1 }}
      />
      <Button variant="contained" onClick={handleCreate}>
        Add User
      </Button>

      <List>
        {data.users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(user.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}