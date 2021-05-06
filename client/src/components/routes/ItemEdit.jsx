import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import apiUrl from "../../apiConfig";
import ItemForm from "../shared/ItemForm";
import Layout from "../shared/Layout";
const ItemEdit = (props) => {
  const [item, setItem] = useState({
    title: "",
    link: "",
  });
  const [updated, setUpdated] = useState(false);

  const updateItem = async () => {
    try {
      const response = await axios(`${apiUrl}/items/${props.match.params.id}`);
      setItem(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    updateItem();
  }, []);

  const handleChange = (event) => {
    const updatedField = { [event.target.name]: event.target.value };

    const editedItem = Object.assign(item, updatedField);

    setItem(editedItem);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios({
      url: `${apiUrl}/items/${props.match.params.id}`,
      method: "PUT",
      data: item,
    })
      .then(() => setUpdated(true))
      .catch(console.error);
  };

  if (updated) {
    return <Redirect to={`/items/${props.match.params.id}`} />;
  }

  return (
    <Layout>
      <ItemForm
        item={item}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        cancelPath={`/items/${props.match.params.id}`}
      />
    </Layout>
  );
};

export default ItemEdit;
