import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../shared/Layout";
const Items = () => {
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    const response = await axios(`http://localhost:3000/api/items`);
    setItems(response.data.items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const itemss = items.map((item) => (
    <li key={item._id}>
      <Link to={`/items/${item._id}`}>{item.title}</Link>
    </li>
  ));
  return (
    <Layout>
      <h4>Items</h4>
      <ul>{itemss}</ul>
    </Layout>
  );
};

export default Items;
