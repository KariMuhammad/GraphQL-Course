const UserBodyWithPassword = `
    name: String!
    email: String!
    password: String!
`;

const UserBody = `
    name: String!
    email: String!
`;

export default `#graphql

type User implements EntityResponse {
    _id: ID!
    ${UserBody}
    todos: [Todo]
}

input UserLoginRequest {
    email: String!
    password: String!
}

type LoginResponse implements JsonResponse {
    success: Boolean!
    message: String!
    token: String!
}

input UserCreateRequest {
    ${UserBodyWithPassword}
}

type UserCreateResponse implements JsonResponse {
    success: Boolean!
    message: String!
    user: User
}

input UserBodyUpdate {
    name: String
    email: String
    password: String
}

input UserUpdateRequest {
    id: ID!
    update: UserBodyUpdate!
}

type UserUpdateResponse implements JsonResponse {
    success: Boolean!
    message: String!
    user: User
}


input UserDeleteRequest {
    id: ID!
}

type UserDeleteResponse implements JsonResponse {
    success: Boolean!
    message: String!
}
`