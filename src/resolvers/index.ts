import { DateResolver } from 'graphql-scalars';

export const resolvers = {
  // The Date resolver enforces the date to be in the YYYY-MM-DD format.
  Date: DateResolver,
  Query: {
    example: () => {
      return 'example';
    },
  },
};
