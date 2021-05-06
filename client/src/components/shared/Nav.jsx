import React from 'react'

import { NavLink } from 'react-router-dom'

const Nav = () => (
  <nav>
    <NavLink to='/'>Home</NavLink>
    <NavLink to='/items'>Items</NavLink>
    <NavLink to='/create-items'>Create Item</NavLink>

  </nav>
)

export default Nav 