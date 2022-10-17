import { VerifyPayloadType } from "@fastify/jwt";
import { ApolloError } from "apollo-server-core";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Context } from "../../utils/createServer";
import {
  FollowUserInput,
  LoginUserInput,
  RegisterUserInput,
  User,
  UserFollows,
} from "./user.dto";
import {
  createUser,
  findUserByEmailOrUserName,
  findUserFollowedBy,
  findUserFollowing,
  findUsers,
  followUser,
  unfollowUser,
  verifyPassword,
} from "./user.service";

@Resolver(() => User)
export default class UserResolver {
  @FieldResolver(() => UserFollows)
  async followers(@Root() user: User) {
    const data = await findUserFollowedBy(user.id);
    return {
      count: data?.followedBy.length,
      items: data?.followedBy,
    };
  }

  @FieldResolver(() => UserFollows)
  async following(@Root() user: User) {
    const data = await findUserFollowing(user.id);
    return {
      count: data?.following.length,
      items: data?.following,
    };
  }

  @Mutation(() => User)
  async register(@Arg("input") input: RegisterUserInput) {
    try {
      const user = await createUser(input);
      return user;
    } catch (e) {
      return e;
    }
  }

  @Query(() => User)
  @Authorized()
  async me(@Ctx() context: Context) {
    return context.user;
  }

  @Mutation(() => String)
  async login(@Arg("input") input: LoginUserInput, @Ctx() context: Context) {
    const user = await findUserByEmailOrUserName(
      input.usernameOrEmail.toLowerCase()
    );

    if (!user) {
      throw new ApolloError("Invalid credentials");
    }

    const isValidPassword = await verifyPassword({
      password: user.password,
      candidatePassword: input.password,
    });

    if (!isValidPassword) {
      throw new ApolloError("Invalid credentials");
    }

    const token = await context.reply?.jwtSign({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    if (!token) {
      throw new ApolloError("Error signing token");
    }

    context.reply?.setCookie("token", token, {
      domain: "localhost",
      path: "/",
      secure: false,
      sameSite: false,
      httpOnly: true,
    });

    return token;
  }

  @Authorized()
  @Mutation(() => User)
  async followUser(
    @Arg("input") input: FollowUserInput,
    @Ctx() context: Context
  ) {
    try {
      const result = await followUser({
        ...input,
        userId: context?.user!.id,
      });
      return result;
    } catch (e) {
      throw new ApolloError(e as string);
    }
  }

  @Authorized()
  @Mutation(() => User)
  async unfollowUser(
    @Arg("input") input: FollowUserInput,
    @Ctx() context: Context
  ) {
    const result = await unfollowUser({
      ...input,
      userId: context?.user!.id,
    });
    return result;
  }

  @Authorized()
  @Query(() => [User])
  async users() {
    return findUsers();
  }
}
