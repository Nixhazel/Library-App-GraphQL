
import userModel from "../../DBmodels/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApolloError } from 'apollo-server';

const userResolvers = {
	Query: {
		async users(root, {}, {}) {
			const allUsers = await userModel.find();
			return allUsers;
		},
		async user(root, { id }) {
			const oneUser = await userModel.findById(id);
			return oneUser;
		},
	},
	Mutation: {
		async createUser(
			root,
			{ registerUserInput: { UserName, email, password } }: any
		) {
			const existingUser = await userModel.findOne({ email });
			if (existingUser) {
				throw new ApolloError(
					`A user already registered with the email ${email}`,
					"USER_ALREADY_EXISTS"
				);
			}
			const salt = await bcrypt.genSaltSync(10);
			const hash = await bcrypt.hashSync(password, salt);
			const newUser = new userModel({
				UserName,
				email: email.toLowerCase(),
				password: hash,
			});
			const res = await newUser.save();
			return res;
		},
		async loginUser(root, { loginUserInput: { email, password } }: any) {
			const existingUser = await userModel.findOne({ email });
			if (!existingUser) {
				throw new ApolloError(
					`The User with the email ${email} Dose not exist`,
					"USER_DOSE_NOT_EXISTS"
				);
			}
			const result = await bcrypt.compareSync(password, existingUser.password);
			if (result) {
				const token = jwt.sign({ id: String(existingUser._id )}, "balablu", {
					expiresIn: "1d",
				});
				console.log(token);
				existingUser["token"] = token;
				return {token, ...existingUser};
			} else {
				throw new ApolloError(
					`The User ${email} Entered a Wrong Password`,
					"WRONG_PASSWORD"
				);
			}
			
		},
	},
};

export default userResolvers;
