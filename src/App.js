import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router";
import { DataContextProvider } from "./context/DataContext";
import "./App.css";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Transactions from "./pages/transactions";
import Settings from "./pages/settings";
import Authentication from "./pages/auth";
import Products from "./pages/products";
import Scanner from "./pages/scanner";

function App() {
  return (
    <div className="app">
      <DataContextProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute path="/" component={<Dashboard />} />}
            />
            <Route path="/login" element={<Authentication />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute path="/dashboard" component={<Dashboard />} />
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute
                  path="/transactions"
                  component={<Transactions />}
                />
              }
            />
            <Route
              path="/transactions/verify/:trackingId"
              element={
                <ProtectedRoute
                  path="/transactions"
                  component={<Transactions />}
                />
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute path="/products" component={<Products />} />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute path="/settings" component={<Settings />} />
              }
            />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/scanner/:orgId/:productId/" element={<Scanner />} />
          </Routes>
        </Router>
      </DataContextProvider>
    </div>
  );
}

export default App;
