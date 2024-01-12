import { ApplicationLogger as logger } from '../logger';
import { GraphQLFormattedError } from 'graphql';

export const formatError = (error: GraphQLFormattedError) => {
  const originalError = error.extensions?.originalError as any;

  if (!originalError) {
    const formatted = {
      message: error.message,
      code: error.extensions?.code,
    };
    logger.warn(formatted.message);
    return formatted;
  }

  const formatted = {
    message: originalError.message,
    code: error.extensions?.code,
  };
  logger.warn(formatted.message);
  return formatted as GraphQLFormattedError;
};
