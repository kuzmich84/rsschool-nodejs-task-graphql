import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

import type { PrismaClient } from '@prisma/client';
import { MemberType } from './memberType.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { Profile } from '../types.js';
import { UserType } from './user.js';
import { memberTypeId } from './memberTypeId.js';

export const ProfileType: GraphQLObjectType<Profile, { prisma: PrismaClient }> =
  new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      isMale: {
        type: GraphQLBoolean,
      },
      yearOfBirth: {
        type: GraphQLInt,
      },
      memberTypeId: {
        type: GraphQLString,
      },
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      user: {
        type: UserType,
        resolve: async ({ userId }, _, { prisma }: { prisma: PrismaClient }) => {
          return prisma.user.findUnique({
            where: { id: userId },
          });
        },
      },
      memberType: {
        type: MemberType,
        resolve: async (
          { memberTypeId }: { memberTypeId: MemberTypeId },
          _,
          { prisma }: { prisma: PrismaClient },
        ) => {
          return prisma.memberType.findUnique({
            where: { id: memberTypeId },
          });
        },
      },
    }),
  });

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});
