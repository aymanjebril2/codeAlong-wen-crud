import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import apiUrl from "../../apiConfig";
import Layout from "../shared/Layout";
const Item = (props) => {
  const [item, setItem] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const fetchItem = async () => {
    const response = await axios(`${apiUrl}/items/${props.match.params.id}`);
    console.log(response);
    setItem(response.data);
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const destroy = async () => {
    await axios({
      url: `${apiUrl}/items/${props.match.params.id}`,
      method: "DELETE",
    })
      .then(() => setDeleted(true))
      .catch(console.error);
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  if (deleted) {
    return (
      <Redirect to={{ pathname: "/", deleted: { msg: "Item deleted!" } }} />
    );
  }
  return (
    <Layout>
      <h4>{item.title}</h4>
      <p>Link: {item.link}</p>
      <button onClick={destroy}>Delete Item</button>
      <Link to={`/items/${props.match.params.id}/edit`}>
        <button>Edit Item</button>
      </Link>
      <Link to="/items">Back To All Items</Link>
    </Layout>
  );
};

export default Item;
