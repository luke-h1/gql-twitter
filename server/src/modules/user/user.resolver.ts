import { Query, Resolver } from "type-graphql";
import User from "./user.dto";

@Resolver(() => User)
export default class UserResolver {
  @Query(() => User, {
    description: "returns a user",
  })
  user() {
    return {
      id: "1",
      email: "yo@yo.com",
      username: "yo",
    };
  }
}
