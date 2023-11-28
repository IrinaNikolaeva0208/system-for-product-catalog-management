import {
  GraphQLDataSourceProcessOptions,
  RemoteGraphQLDataSource,
} from '@apollo/gateway/dist';
import { GraphQLDataSourceRequestKind } from '@apollo/gateway/dist/datasources/types';

export class GraphQLDataSource extends RemoteGraphQLDataSource {
  didReceiveResponse({
    response,
    context,
  }: {
    response: any;
    context: any;
  }): typeof response {
    const cookies = response.http.headers?.raw()['set-cookie'] as
      | string[]
      | null;

    if (cookies) {
      context?.req.res.append('set-cookie', cookies);
    }

    return response;
  }

  willSendRequest(params: GraphQLDataSourceProcessOptions) {
    const { request, kind } = params;

    if (kind === GraphQLDataSourceRequestKind.INCOMING_OPERATION) {
      const cookie =
        params?.incomingRequestContext.request.http?.headers.get('Cookie');
      request.http?.headers.set('Cookie', cookie as string);

      const authHeader =
        params?.incomingRequestContext.request.http?.headers.get(
          'authorization',
        );
      request.http?.headers.set('authorization', authHeader as string);
    }
  }
}
