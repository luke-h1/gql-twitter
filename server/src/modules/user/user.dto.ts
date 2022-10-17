import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export default class User {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  email: string;

  password: string;
}
