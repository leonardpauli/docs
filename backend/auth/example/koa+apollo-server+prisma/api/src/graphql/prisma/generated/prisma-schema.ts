export const typeDefs = /* GraphQL */ `type AggregateNote {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Long

type Mutation {
  createNote(data: NoteCreateInput!): Note!
  updateNote(data: NoteUpdateInput!, where: NoteWhereUniqueInput!): Note
  updateManyNotes(data: NoteUpdateInput!, where: NoteWhereInput): BatchPayload!
  upsertNote(where: NoteWhereUniqueInput!, create: NoteCreateInput!, update: NoteUpdateInput!): Note!
  deleteNote(where: NoteWhereUniqueInput!): Note
  deleteManyNotes(where: NoteWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type Note {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  published: Boolean!
  author: User!
  text: String!
}

type NoteConnection {
  pageInfo: PageInfo!
  edges: [NoteEdge]!
  aggregate: AggregateNote!
}

input NoteCreateInput {
  published: Boolean
  author: UserCreateOneInput!
  text: String!
}

type NoteEdge {
  node: Note!
  cursor: String!
}

enum NoteOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  published_ASC
  published_DESC
  text_ASC
  text_DESC
}

type NotePreviousValues {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  published: Boolean!
  text: String!
}

type NoteSubscriptionPayload {
  mutation: MutationType!
  node: Note
  updatedFields: [String!]
  previousValues: NotePreviousValues
}

input NoteSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: NoteWhereInput
  AND: [NoteSubscriptionWhereInput!]
  OR: [NoteSubscriptionWhereInput!]
  NOT: [NoteSubscriptionWhereInput!]
}

input NoteUpdateInput {
  published: Boolean
  author: UserUpdateOneRequiredInput
  text: String
}

input NoteWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  published: Boolean
  published_not: Boolean
  author: UserWhereInput
  text: String
  text_not: String
  text_in: [String!]
  text_not_in: [String!]
  text_lt: String
  text_lte: String
  text_gt: String
  text_gte: String
  text_contains: String
  text_not_contains: String
  text_starts_with: String
  text_not_starts_with: String
  text_ends_with: String
  text_not_ends_with: String
  AND: [NoteWhereInput!]
  OR: [NoteWhereInput!]
  NOT: [NoteWhereInput!]
}

input NoteWhereUniqueInput {
  id: ID
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  note(where: NoteWhereUniqueInput!): Note
  notes(where: NoteWhereInput, orderBy: NoteOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Note]!
  notesConnection(where: NoteWhereInput, orderBy: NoteOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): NoteConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

enum Role {
  ADMIN
  USER
}

type Subscription {
  note(where: NoteSubscriptionWhereInput): NoteSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  createdAt: DateTime!
  email: String!
  hash: String!
  emailVerified: Boolean!
  roles: [Role!]!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  email: String!
  hash: String!
  emailVerified: Boolean
  roles: UserCreaterolesInput
}

input UserCreateOneInput {
  create: UserCreateInput
  connect: UserWhereUniqueInput
}

input UserCreaterolesInput {
  set: [Role!]
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  email_ASC
  email_DESC
  hash_ASC
  hash_DESC
  emailVerified_ASC
  emailVerified_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  createdAt: DateTime!
  email: String!
  hash: String!
  emailVerified: Boolean!
  roles: [Role!]!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateDataInput {
  email: String
  hash: String
  emailVerified: Boolean
  roles: UserUpdaterolesInput
}

input UserUpdateInput {
  email: String
  hash: String
  emailVerified: Boolean
  roles: UserUpdaterolesInput
}

input UserUpdateOneRequiredInput {
  create: UserCreateInput
  update: UserUpdateDataInput
  upsert: UserUpsertNestedInput
  connect: UserWhereUniqueInput
}

input UserUpdaterolesInput {
  set: [Role!]
}

input UserUpsertNestedInput {
  update: UserUpdateDataInput!
  create: UserCreateInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  hash: String
  hash_not: String
  hash_in: [String!]
  hash_not_in: [String!]
  hash_lt: String
  hash_lte: String
  hash_gt: String
  hash_gte: String
  hash_contains: String
  hash_not_contains: String
  hash_starts_with: String
  hash_not_starts_with: String
  hash_ends_with: String
  hash_not_ends_with: String
  emailVerified: Boolean
  emailVerified_not: Boolean
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`