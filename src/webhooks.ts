// eslint-disable-next-line import/no-unresolved
import { APIGatewayEvent } from 'aws-lambda';
import { get, isEmpty } from 'lodash';
import axios from 'axios';
import { verifyToken, badRequest, unAuthorized } from './utils';

type WebhookConfig = {
  requiredFields?: Array<string>;
  integrationUrl?: string;
};

type Body = {
  config: WebhookConfig;
};

const forwardRequest = (url, data, headers) => {
  try {
    const response = axios.post(url, data, {
      headers,
      maxContentLength: Number.parseInt(
        get(process, 'env.MAX_CONTENT_LENGTH', 52428890),
        10
      ),
    });
    return {
      statusCode: 200,
      message: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: error.code || 500,
      message: `${error}`,
    };
  }
};

export default async (event: APIGatewayEvent): Promise<any> => {
  try {
    const body = get(event, 'body', null);
    if (!body) {
      return badRequest();
    }
    const { authorization }: { authorization: string } = get(
      event,
      'headers.Authorization',
      ''
    );
    if (!verifyToken(authorization)) {
      return unAuthorized();
    }

    const parsedBody: Body = JSON.parse(body);
    const requiredFields = get(parsedBody, 'config.requiredFields', []);
    const integrationUrl = get(parsedBody, 'config.integrationUrl', '');

    if (!integrationUrl) {
      return badRequest();
    }

    for (let i = 0; i < requiredFields.length; i += 1) {
      const fieldPath = requiredFields[i];
      if (isEmpty(get(parsedBody, fieldPath, null))) {
        return {
          statusCode: 200,
          message: `Not forwarding this request because ${fieldPath} is missing in ${parsedBody}`,
        };
      }
    }

    return forwardRequest(integrationUrl, parsedBody, event.headers);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: `Something went wrong ${err}`,
    };
  }
};
