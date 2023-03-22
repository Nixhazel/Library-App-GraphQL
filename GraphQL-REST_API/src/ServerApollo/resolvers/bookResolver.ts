import { ApolloError } from "apollo-server";
import bookModel from "../../DBmodels/bookModel";

const bookResolvers = {
	Query: {
		async books(root, {}, {}) {
			const allBooks = await bookModel.find();
			return allBooks;
		},
		async book(root, { id }) {
			const oneBook = await bookModel.findById(id);
			return oneBook;
		},
	},
	Mutation: {
		async createBook(
			root,
			{
				createBookInput: {
					Title,
					Author,
					datePublished,
					Description,
					pageCount,
					Genre,
					publisher,
				},
			}: any,
			context
		) {
			if (!context.user) {
				return null;
			}
			const existingBookPublisher = await bookModel.findOne({ publisher });
			const existingBookTitle = await bookModel.findOne({ Title });
			if (existingBookPublisher || existingBookTitle) {
				throw new ApolloError(
					`Book with the Title: ${Title} or with the Publisher: ${publisher} already exist`,
					"BOOK_ALREADY-EXISTS"
				);
			}

			const newBook = new bookModel({
				UserId: context.user._id,
				Title,
				Author,
				datePublished,
				Description,
				pageCount,
				Genre,
				publisher,
			});
			const res = await newBook.save();
			return res;
		},
		async updateBook(
			root,
			{
				id,
				updateBookInput: {
					Title,
					Author,
					datePublished,
					Description,
					pageCount,
					Genre,
					publisher,
				},
			}: any,
			context
		) {
			if (!context.user._id) {
				throw new ApolloError(
					`UNAUTHORIZED USER`,
					"AUTHORIZATION FAILED, CANNOT FIND USER"
				);
			}
			const existingBook = await bookModel.findById(id);
			if (!existingBook) {
				throw new ApolloError(
					`Book with the id: ${id} dose not exist`,
					"BOOK_DOSE_NOT_EXIST"
				);
			}
			const edidted = (
				await bookModel.updateOne(
					{ _id: id },
					{
						Title,
						Author,
						datePublished,
						Description,
						pageCount,
						Genre,
						publisher,
					}
				)
			).modifiedCount;
			return edidted;
		},
		async deleteBook(root, { id }, context) {
			if (!context.user._id) {
				throw new ApolloError(
					`UNAUTHORIZED USER`,
					"AUTHORIZATION FAILED, CANNOT FIND USER"
				);
			}
			const existingBook = await bookModel.findById(id);
			if (!existingBook) {
				throw new ApolloError(
					`Book with the id: ${id} dose not exist`,
					"BOOK_DOSE_NOT_EXIST"
				);
			}
			const deleted = (await bookModel.deleteOne({ _id: id })).deletedCount;
			return deleted;
		},
	},
};

export default bookResolvers;
