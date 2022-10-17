import prisma from "../../utils/prisma";
import { LoginUserInput, RegisterUserInput } from "./user.dto";
import argon2 from "argon2";

export async function createUser(input: RegisterUserInput) {
  // hash password
  const password = await argon2.hash(input.password);

  // insert user into DB
  return prisma.user.create({
    data: {
      ...input,
      email: input.email.toLowerCase(),
      username: input.username.toLowerCase(),
      password,
    },
  });
}

export async function findUserByEmailOrUserName(
  input: LoginUserInput["usernameOrEmail"]
) {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          username: input,
        },
        {
          email: input,
        },
      ],
    },
  });
}

export async function verifyPassword({
  password,
  candidatePassword,
}: {
  password: string; // from DB
  candidatePassword: string; // from request
}): Promise<boolean> {
  return argon2.verify(password, candidatePassword);
}

export async function followUser({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      following: {
        connect: {
          username,
        },
      },
    },
  });
}

export async function unfollowUser({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      following: {
        disconnect: {
          username,
        },
      },
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany();
}

export async function findUserFollowing(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      following: true,
    },
  });
}

export async function findUserFollowedBy(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      followedBy: true,
    },
  });
}

export async function findUserById(userId: string) {
  return prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
}
