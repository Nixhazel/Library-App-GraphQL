import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

type JsonPayLoad = {
    id;string
}

const auth = (token: string) => {

        if (token) {
            try {
                const decodedUser = jwt.verify(token, "balablu") as JsonPayLoad;
                return decodedUser
            } catch (error) {
                throw new AuthenticationError(" Expired or Wrong Token");
            }
        }
        throw new AuthenticationError(" Authorization Token Must be Bearer Token");

}

export default auth;