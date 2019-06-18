import React from "react";
import { Router, Link } from "@reach/router";
import Recipe from "./Recipe/index";
// import NewRecipe from "./NewRecipe";
import List from "./List";

export default function App() {
  return (
    <div className="main">
      <nav>
        <Link to="/">Liste</Link>   <Link to="/new">+ Nouvelle Recette</Link>
      </nav>
      <br />
      <Router>
        <List path="/" />
        {/* <NewRecipe path="/new" /> */}
        <Recipe path="/:id" />
      </Router>
    </div>
  );
}
