# GraphQL API - User & Todo Management

## Quick Run

The project uses `nodemon` for development. You can start the server by running:

```bash
npm start
```

The server will run on `http://localhost:9000/graphql`.

## Example Queries

### 1. Get All Users and their Todos

```graphql
query GetAll {
  users {
    name
    email
    todos {
      title
      status
    }
  }
}
```

### 2. Get Todos for a Specific User

```graphql
query GetUserTodos {
  todosByUser(userId: "USER_ID_HERE") {
    title
    status
  }
}
```

### 3. Register a New User

```graphql
mutation Register {
  register(
    request: {
      name: "John Doe"
      email: "john@yahoo.com"
      password: "password123"
    }
  ) {
    success
    message
    user {
      _id
      name
    }
  }
}
```

### 4. Login and Get Token

```graphql
mutation Login {
  login(request: { email: "john@yahoo.com", password: "password123" }) {
    success
    message
    token
  }
}
```

### 5. Create a Todo (Requires Auth Header)

_Add `Authorization: Bearer <TOKEN>` in Headers_

```graphql
mutation AddTodo {
  addTodo(
    request: {
      title: "Complete GraphQL Lab"
      status: PENDING
      userId: "USER_ID_HERE"
    }
  ) {
    success
    todo {
      _id
      title
    }
  }
}
```
