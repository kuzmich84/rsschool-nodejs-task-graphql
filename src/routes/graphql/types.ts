import { UUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';

export type GraphqlContext = {
  prisma: PrismaClient;
};

export type Profile = {
  id: UUID;
  isMale: boolean;
  yearOfBirth: number;
  userId: UUID;
  memberTypeId: MemberTypeId;
};

export type Post = {
  id: UUID;
  title: string;
  content: string;
  authorId: UUID;
};

export type Subscription = {
  subscriberId: UUID;
  authorId: UUID;
};

export type User = {
  id: UUID;
  name: string;
  balance: number;
  posts: Post[];
  profile: Profile;
  userSubscribedTo: Subscription[];
  subscribedToUser: Subscription[];
};

export type Member = {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
};
