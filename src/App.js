import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Container from "react-bootstrap/Container";
import InvoiceModal from "./components/InvoiceModal";
import { routes } from "./data/routes";
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <Container>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            element={<route.component />}
          />
        ))}
      </Routes>

      {/* Render all Modals here */}
      <InvoiceModal />
      <Toaster />
    </Container>
  );
};

export default App;
