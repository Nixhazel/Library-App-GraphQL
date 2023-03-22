// import { ApolloServer } from "apollo-server";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import mongoose from "mongoose";
dotenv.config();
import { strict as assert } from "assert";
import { load } from "ts-dotenv";
import resolvers from "./ServerApollo/resolvers";
import { typeDefs } from "./ServerApollo/typeDefs";
import auth from './middleware/auth';
import userModel from "./DBmodels/userModel";
mongoose.set("strictQuery", true);

const env = load({
	MONGO_URL: String,
});
assert.ok(env.MONGO_URL === process.env.MONGO_URL);
// console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.on("connected", () => {
	console.log("MongoDB is connected");
});


const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// mongoose.connect(process.env.MONGO_URL).then(() => {
//     console.log("MongoDB connection Successful");
//     return server.listen({port:4000})
// }).then((res)=>{
//     console.log("🚀 Server Running on :", res.url);
// })



const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
        const token = req.headers.authorization || ''
        if (token) {
            const { id } = auth(token)
            const user = await userModel.findById(id)
            return {user};
        }

    }
});

console.log(`🚀  Server ready at: ${url}`);
