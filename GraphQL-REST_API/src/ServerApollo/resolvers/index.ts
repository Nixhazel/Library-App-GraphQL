import userResolvers from "./userResolver";
import bookResolvers from "./bookResolver";



const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...bookResolvers.Query
    },
    Mutation: {
        ...bookResolvers.Mutation,
        ...userResolvers.Mutation
    }
}

export default resolvers;