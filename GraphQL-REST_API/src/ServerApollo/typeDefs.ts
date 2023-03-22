import { gql } from "apollo-server";
// import { ObjectId } from 'mongodb';
import bookModel from '../DBmodels/bookModel';

export const typeDefs = gql`
	type Book {
		_id: String
		UserId: String
		Title: String!
		Author: String!
		datePublished: String!
		Description: String!
		pageCount: Int!
		Genre: String!
		publisher: String!
	}
	type User {
		_id: String
		UserName: String
		email: String
		password: String
		token: String
	}
	input CreateBookInput {
		Title: String!
		Author: String!
		datePublished: String!
		Description: String!
		pageCount: Int!
		Genre: String!
		publisher: String!
	}
	input RegisterUserInput {
		UserName: String!
		email: String!
		password: String!
	}
	input LoginUserInput {
		email: String!
		password: String!
	}
	input UpdateBookInput {
		Title: String
		Author: String
		datePublished: String
		Description: String
		pageCount: Int
		Genre: String
		publisher: String
	}
	type Query {
		books: [Book!]!
		book(id: String!): Book!
		users: [User!]!
		user(id: String!): User!
	}
	type Mutation {
		createBook(createBookInput: CreateBookInput): Book
		createUser(registerUserInput: RegisterUserInput): User
		loginUser(loginUserInput: LoginUserInput): User
		deleteBook(id: ID!): Boolean
		updateBook(id: ID!, updateBookInput: UpdateBookInput): Boolean
	}
`;