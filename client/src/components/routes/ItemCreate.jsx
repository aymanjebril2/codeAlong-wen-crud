import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import ItemForm from "../shared/ItemForm";
import Layout from "../shared/Layout";

const ItemCreate = (props) => {
  const [item, setItem] = useState({ title: "", link: "" });
  const [createdItem, setCreatedItem] = useState(null);

  const handleChange = (event) => {
    const updatedField = { [event.target.name]: event.target.value };

    const editedItem = Object.assign(item, updatedField);

    setItem(editedItem);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios({
      url: `http://localhost:3000/api/items`,
      method: "POST",
      data: item,
    })
      .then((res) => setCreatedItem(res.data.item))
      .catch(console.error);
  };

  if (createdItem) {
    return <Redirect to={`/items`} />;
  }
  //   if (createdItem) {
  //     return <Redirect to={`/items/${props.match.params.id}`} />;
  //   }

  return (
    <div>
      <Layout>
        <ItemForm
          item={item}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          // cancelPath="/"
        />
      </Layout>
    </div>
  );
};

export default ItemCreate;
