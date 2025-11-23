import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';

import { memberTypeId } from './memberTypeId.js';
import { GraphqlContext, Member } from '../types.js';

export const MemberType: GraphQLObjectType<Member, GraphqlContext> =
  new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: {
        type: memberTypeId,
      },
      discount: {
        type: GraphQLFloat,
      },
      postsLimitPerMonth: {
        type: GraphQLInt,
      },
    }),
  });
