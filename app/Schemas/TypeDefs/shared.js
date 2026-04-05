export default `#graphql
type Query {
    users: [User]
    user(id: ID!): User
    todos: [Todo]
    todo(id: ID!): Todo
    todosByUser(userId: ID!): [Todo]
}

type Mutation {
    # User Mutations
    register(request: UserCreateRequest!): UserCreateResponse!
    login(request: UserLoginRequest!): LoginResponse!
    updateUser(request: UserUpdateRequest!): UserUpdateResponse!
    deleteUser(id: ID!): UserDeleteResponse!

    # Todo Mutations
    addTodo(request: TodoCreateRequest!): TodoCreateResponse!
    updateTodo(request: TodoUpdateRequest!): TodoUpdateResponse!
    deleteTodo(id: ID!): TodoDeleteResponse!
}

interface EntityResponse {
    _id: ID!
}

interface JsonResponse {
    success: Boolean!
    message: String!
}

enum TodoStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
}
`