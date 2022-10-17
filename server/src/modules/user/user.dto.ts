import { IsEmail, Length } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  email: string;

  password: string;
}

@InputType()
export class RegisterUserInput {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  @IsEmail()
  email: string;

  @Field({ nullable: false })
  @Length(6, 56)
  password: string;
}

@InputType()
export class LoginUserInput {
  @Field({ nullable: false })
  usernameOrEmail: string;

  @Field({ nullable: false })
  password: string;
}

@ObjectType()
export class UserFollows {
  @Field(() => Int)
  count: number;

  @Field(() => [User])
  items: User[];
}

@InputType()
export class FollowUserInput {
  @Field()
  username: string;
}
