const TodoBody = `
    title: String!
    status: TodoStatus!
`;

export default `#graphql

type Todo implements EntityResponse {
    _id: ID!
    ${TodoBody}
    user: User
}

input TodoCreateRequest {
    ${TodoBody}
    userId: ID!
}

type TodoCreateResponse implements JsonResponse {
    success: Boolean!
    message: String!
    todo: Todo
}

input TodoBodyUpdate {
    title: String
    status: TodoStatus
}

input TodoUpdateRequest {
    id: ID!
    update: TodoBodyUpdate!
}

type TodoUpdateResponse implements JsonResponse {
    success: Boolean!
    message: String!
    todo: Todo
}

type TodoDeleteResponse implements JsonResponse {
    success: Boolean!
    message: String!
    deletedId: ID
}
`