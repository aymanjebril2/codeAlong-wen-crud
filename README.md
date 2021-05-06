![](https://i.imgur.com/HJFBtp4.png)

# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)  SOFTWARE ENGINEERING IMMERSIVE

## Getting Started

1. Fork
2. Clone

# MongoDB, Mongoose, Express, and React - CRUD

![](StackArchitecture.png)

We've built the backend. Now it's time to build the frontend.

In this project we are going to be using react to build a CRUD frontend to our items json api.

```sh
cd mongodb-express-react
npm install
```


Before we start, make sure the tests pass:

```sh
npm test
```

Populate the database with seed data:

```sh
node seed/items.js
```

Make sure the data exists:

```sh
mongo
> use itemsDatabase
> db.items.find()
```

Run the server:

```sh
npm start
```

Test the following route in your browser:

- http://localhost:3000/api/items

Now open a new tab in the terminal. Make sure you're inside the repo.

Let's create our React app.

```sh
cd mongodb-express-react
npx create-react-app client
```

Let's start by adding [react router]():

```sh
cd client
npm install react-router-dom
```
> Important: Notice how there are two package.json's one in the root of the repo for the server, and the other inside the client folder. Make sure you're inside the client folder. We want to install the react router package so we can use it for the react app.

And now let's setup our app to use react router:

client/index.js
```js
import {BrowserRouter as Router} from 'react-router-dom'

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
```

Cool. Now let's setup our routes.  A route will render an associated component. Below is the list:

`/` - the homepage, just display a welcome screen. It will render a Home component.

`/items` - the ability to see all items. It will render an Items component.

`/create-item` - the ability to create a new item. It will render an ItemCreate component.

`/items/:id` - the ability to see a specific item. It will render an Item component.

`/items/:id/edit` - the ability to edit an item. It will render an ItemEdit component.

Let's start by creating our empty components:

```sh
cd src
mkdir components
cd components
mkdir routes
cd routes
touch Home.jsx Item.jsx ItemCreate.jsx ItemEdit.jsx Items.jsx
```

Now let's create our routes:

client/App.js
```js
import React from 'react'
import { Route, withRouter } from 'react-router-dom'

import Items from './components/routes/Items'
import Item from './components/routes/Item'
import ItemEdit from './components/routes/ItemEdit'
import ItemCreate from './components/routes/ItemCreate'
import Home from './components/routes/Home'

const App = props => (
  <React.Fragment>
    <h3>{props.location.state ? props.location.state.msg : null}</h3>
    <Route exact path='/' component={Home} />
    <Route exact path='/items' component={Items} />
    <Route exact path='/create-item' component={ItemCreate} />
    <Route exact path='/items/:id' component={Item} />
    <Route exact path='/items/:id/edit' component={ItemEdit} />
  </React.Fragment>
)

export default withRouter(App)
```

A simple Home component:
src/components/routes/Home.jsx
```js
import React from 'react'
import Layout from '../shared/Layout'

const Home = () => (
  <Layout>
    <h4>Welcome to the items app!</h4>
  </Layout>
)

export default Home
```

Notice the Layout component. We are going to build the Layout component next. This is a shared component that we will re-use multiple times. Essentially, the Layout component is the shell of the web app we are building.

Let's create our "shared" components. The idea of shared components is that anytime we have code that we would repeat in several components (a footer, a navbar, etc), we can wrap that code inside a component and import it in whenever needed.

```sh
cd client/src/components
mkdir shared
cd shared
touch Layout.jsx Footer.jsx Nav.jsx
```

Let's start with the Layout component:

components/shared/Layout.jsx
```js
import React from 'react'

import Nav from './Nav'
import Footer from './Footer'

const Layout = props => (
  <div>
    <h1>Items App</h1>
    <Nav />

    {props.children}

    <Footer />
  </div>
)

export default Layout
```

> Note: We are using `props.children` here. [React Children](https://reactjs.org/docs/react-api.html#reactchildren) is a placeholder for which ever component calls the component that `props.children` is in. You will see this in action in a minute.

Let's create our Nav component:

components/shared/Nav.jsx
```js
import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => (
  <nav>
    <NavLink to='/'>Home</NavLink>
    <NavLink to='/items'>Items</NavLink>
    <NavLink to='/create-item'>Create Item</NavLink>
  </nav>
)

export default Nav
```

And the Footer component:

components/shared/Footer.jsx

```js
import React from 'react'

const Footer = () => (
  <p>© Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
)

export default Footer
```

Let's make sure the app is working.

```sh
cd mongodb-express-react
npm start
```

Open a new tab in your terminal and run your client:

```sh
cd client
npm start
```

Open your browser and test the route http://localhost:3001/. The Home component should render but the other links will not work yet because we haven't built them out yet.

Cool. We are done with shared components for now.

Now let's build the Items component.

We will be making an axios call in the Items component to fetch all the Items from the server. 

Let's start by installing [axios](https://www.npmjs.com/package/axios). Make sure you're in the client folder.

```sh
cd client
npm install axios
```

> When you run `npm install axios`, make sure you're inside the client folder where the package.json exists.

Now we can build the Items component:

src/components/routes/Items.js
```js
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Items extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: []
    }
  }

  async componentDidMount () {
    try {
      const response = await axios(`http://localhost:3000/api/items`)
      this.setState({ items: response.data.items })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const items = this.state.items.map(item => (
      <li key={item._id}>
        <Link to={`/items/${item._id}`}>{item.title}</Link>
      </li>
    ))

    return (
      <>
        <h4>Items</h4>
        <ul>
          {items}
        </ul>
      </>
    )
  }
}

export default Items
```

Test the http://localhost:3001/items route in your browser.

Good? Great. Let's move on to the Item component.

components/routes/Item.jsx
```js
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import Layout from '../shared/Layout'

class Item extends Component {
  constructor(props) {
    super(props)

    this.state = {
      item: null,
      deleted: false
    }
  }

  async componentDidMount() {
    try {
      const response = await axios(`http://localhost:3000/api/items/${this.props.match.params.id}`)
      this.setState({ item: response.data })
    } catch (err) {
      console.error(err)
    }
  }

  destroy = () => {
    axios({
      url: `http://localhost:3000/api/items/${this.props.match.params.id}`,
      method: 'DELETE'
    })
      .then(() => this.setState({ deleted: true }))
      .catch(console.error)
  }

  render() {
    const { item, deleted } = this.state

    if (!item) {
      return <p>Loading...</p>
    }

    if (deleted) {
      return <Redirect to={
        { pathname: '/', state: { msg: 'Item succesfully deleted!' } }
      } />
    }

    return (
      <Layout>
        <h4>{item.title}</h4>
        <p>Link: {item.link}</p>
        <button onClick={this.destroy}>Delete Item</button>
        <Link to={`/items/${this.props.match.params.id}/edit`}>
          <button>Edit</button>
        </Link>
        <Link to="/items">Back to all items</Link>
      </Layout>
    )
  }
}

export default Item
```

We should now be able to see http://localhost:3001/items/1.

Next, we want to implement the ItemEdit and ItemCreate. Inside the ItemEdit component we will have a form to edit an item. And Inside the ItemCreate component we will have form to create an item. What if we could abstract those two forms into one? We can, so let's do that now by creating another shared component called ItemForm:

```sh
cd components/shared/
touch ItemForm.jsx
```

components/shared/ItemForm.jsx
```js
import React from 'react'
import { Link } from 'react-router-dom'

const ItemForm = ({ item, handleSubmit, handleChange, cancelPath }) => (
  <form onSubmit={handleSubmit}>
    <label>Title</label>
    <input
      placeholder="A vetted item."
      value={item.title}
      name="title"
      onChange={handleChange}
    />

    <label>Link</label>
    <input
      placeholder="http://acoolitem.com"
      value={item.link}
      name="link"
      onChange={handleChange}
    />

    <button type="submit">Submit</button>
    <Link to={cancelPath}>
      <button>Cancel</button>
    </Link>
  </form>
)

export default ItemForm
```

Awesome! Now let's build our ItemEdit component:

components/routes/ItemEdit.jsx
```js
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import ItemForm from '../shared/ItemForm'
import Layout from '../shared/Layout'

class ItemEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            item: {
                title: '',
                link: ''
            },
            updated: false
        }
    }

    async componentDidMount() {
        try {
            const response = await axios(`http://localhost:3000/api/items/${this.props.match.params.id}`)
            this.setState({ item: response.data })
        } catch (err) {
            console.error(err)
        }
    }

    handleChange = event => {
        const updatedField = { [event.target.name]: event.target.value }

        const editedItem = Object.assign(this.state.item, updatedField)

        this.setState({ item: editedItem })
    }

    handleSubmit = event => {
        event.preventDefault()

        axios({
            url: `http://localhost:3000/api/items/${this.props.match.params.id}`,
            method: 'PUT',
            data: this.state.item
        })
            .then(() => this.setState({ updated: true }))
            .catch(console.error)
    }

    render() {
        const { item, updated } = this.state
        const { handleChange, handleSubmit } = this

        if (updated) {
            return <Redirect to={`/items/${this.props.match.params.id}`} />
        }

        return (
            <Layout>
                <ItemForm
                    item={item}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    cancelPath={`/items/${this.props.match.params.id}`}
                />
            </Layout>
        )
    }
}

export default ItemEdit
```

Let's test that. Open http://localhost:3001/items/1 and edit a field.

Nice! Now try delete. Bye.

Ok. We have one last CRUD action to complete in our react app - CREATE. Let's build the ItemCreate component and use our ItemForm shared component:

components/routes/ItemCreate.jsx
```js
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import ItemForm from '../shared/ItemForm'
import Layout from '../shared/Layout'

class ItemCreate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            item: {
                title: '',
                link: ''
            },
            createdItem: null
        }
    }

    handleChange = event => {
        const updatedField = { [event.target.name]: event.target.value }

        const editedItem = Object.assign(this.state.item, updatedField)

        this.setState({ item: editedItem })
    }

    handleSubmit = event => {
        event.preventDefault()

        axios({
            url: `http://localhost:3000/api/items`,
            method: 'POST',
            data: this.state.item
        })
            .then(res => this.setState({ createdItem: res.data.item }))
            .catch(console.error)
    }

    render() {
        const { handleChange, handleSubmit } = this
        const { createdItem, item } = this.state

        if (createdItem) {
            return <Redirect to={`/items`} />
        }

        return (
            <Layout>
                <ItemForm
                    item={item}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    cancelPath="/"
                />
            </Layout>
        )
    }
}

export default ItemCreate
```

Great, test the create in your browser.

We now have full CRUD complete on the backend and on the frontend.

Success.

### Bonus: Refactoring

Notice how we using the api url in multiple components. What would happen if we need to update the url, we would have to change it in several places. What if we could store the api url in one place and have it accessed from there? That way if we want to change the api url, we only change it in one place. We can do this!

Let's create an apiConfig component:

src/
```sh
touch apiConfig.jsx
```

src/apiConfig.jsx
```js
let apiUrl
const apiUrls = {
  production: 'https://sei-items-api.herokuapp.com/api',
  development: 'http://localhost:3000/api'
}

if (window.location.hostname === 'localhost') {
  apiUrl = apiUrls.development
} else {
  apiUrl = apiUrls.production
}

export default apiUrl
```

Now replace all instances of http://localhost:3000/api in you Items, Item, ItemCreate, and ItemEdit components with `${apiUrl}` and don't forget to import the apiConfig component: `import apiUrl from '../../apiConfig'`

## Deployment
![](https://miro.medium.com/max/1320/1*owg5RPtazedwH8fxpZF_vg.png)
> Image from [heroku.com](https://www.heroku.com)

Let's deploy our app to [heroku](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).

First we need to update our package.json:

```js
  "scripts": {
    "test": "npx jest tests --detectOpenHandles",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
```

> Make sure you're on the `master` branch!

1. `heroku create your-heroku-app-name`
2. `heroku buildpacks:set heroku/nodejs`
3. `heroku addons:add mongolab`
> `heroku config:set PROD_MONGODB="<INSERT YOUR MONGODB URI CONNECTION STRING HERE>"`
4. `git status`
5. `git commit -am "add any pending changes"`
6. `git push heroku master`
7. `heroku run node seed/items.js`

> Having issues? Debug with the Heroku command `heroku logs --tail` to see what's happening on the Heroku server.

Test the endpoint :)

> https://your-heroku-app-name.herokuapp.com/api/items

## Deploying React

First you will have to replace anywhere inside your react app where you made an axios call to localhost:3000 to https://your-heroku-app-name.herokuapp.com - if you completed the bonus that means you will only have to update the apiConfig.js file with https://your-heroku-app-name.herokuapp.com as the value for the production key.

Now let's deploy the frontend:

```sh
cd client
npm run build
cd build
mv index.html 200.html
npx surge
```

> Follow the prompts on Surge. Test the frontend routes once deployed. Getting errors? Check the browser dev tools. Check `heroku logs --tail`

Congrats! You built a full crud app with a backend and a frontend. You are now a fullstack developer!

> ✊ **Fist to Five**

## Feedback

> [Take a minute to give us feedback on this lesson so we can improve it!](https://forms.gle/vgUoXbzxPWf4oPCX6)
