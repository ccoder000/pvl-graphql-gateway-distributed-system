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

const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Float!) {
    createProduct(name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function Products() {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleCreate = async () => {
    if (!name || !price) return;
    await createProduct({ variables: { name, price: parseFloat(price) } });
    setName("");
    setPrice("");
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteProduct({ variables: { id } });
    refetch();
  };

  if (loading) return <Typography>Loading products...</Typography>;
  if (error) return <Typography>Error loading products</Typography>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Products
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mr: 1 }}
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        sx={{ mr: 1 }}
      />
      <Button variant="contained" onClick={handleCreate}>
        Add Product
      </Button>

      <List>
        {data.products.map((product) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(product.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={product.name}
              secondary={`$${product.price}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}