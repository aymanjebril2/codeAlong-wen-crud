import React from "react";
import { Route, withRouter } from "react-router-dom";

import Items from "./components/routes/Items";
import Item from "./components/routes/Item";
import ItemEdit from "./components/routes/ItemEdit";
import ItemCreate from "./components/routes/ItemCreate";
import Home from "./components/routes/Home";

const App = (props) => (
  <>
    <h3>{props.location.state ? props.location.state.msg : null}</h3>
    <Route exact path="/" component={Home} />
    <Route exact path="/items" component={Items} />
    <Route exact path="/create-items" component={ItemCreate} />
    <Route exact path="/items/:id" component={Item} />
    <Route exact path="/items/:id/edit" component={ItemEdit} />
  </>
);

export default withRouter(App);
