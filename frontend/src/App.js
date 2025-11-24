import React from "react";
import { Container, Typography, Divider } from "@mui/material";
import Users from "./components/Users";
import Products from "./components/Products";

function App() {
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Modern Distributed Systems PVL - GraphQL Gateway
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Users />

      <Divider sx={{ my: 3 }} />

      <Products />
    </Container>
  );
}

export default App;