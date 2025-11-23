import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  parse,
  validate,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { MemberType } from './types/memberType.js';
import { PostType } from './types/postType.js';
import { memberTypeId } from './types/memberTypeId.js';
import { ProfileType } from './types/ProfileType.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.user.findMany();
        },
      },
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.user.findUnique({ where: { id } });
        },
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.post.findUnique({ where: { id } });
        },
      },
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(memberTypeId) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.memberType.findUnique({
            where: { id },
          });
        },
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_, __, { prisma }: FastifyInstance) => {
          return await prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          return await prisma.profile.findUnique({ where: { id } });
        },
      },
    },
  }),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body: { query, variables } }) {
      const document = parse(query);
      const gqlErrors = validate(schema, document, [depthLimit(5)]);

      if (gqlErrors.length) return { data: null, errors: gqlErrors };

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: fastify,
      });
    },
  });
};

export default plugin;
