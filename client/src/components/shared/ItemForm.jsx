import React from "react";
import { Link } from "react-router-dom";

const ItemForm = ({ item, handleSubmit, handleChange, cancelPath }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          placeholder="A Fan"
          // value={item}
          name="title"
          onChange={handleChange}
        />

        <label htmlFor="link"></label>
        <input
          placeholder="https://afan.edu"
          // value={item.link}
          name="link"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
        <Link to={cancelPath}>
          <button>Cancel</button>
        </Link>
      </form>
    </div>
  );
};

export default ItemForm;
