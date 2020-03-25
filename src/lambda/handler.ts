import { createCcXmlFromGithubPersonalAccessToken } from "..";

export async function handler(event: {
  queryStringParameters: { personalAccessToken?: string };
}) {
  const { personalAccessToken } = event.queryStringParameters;

  if (personalAccessToken == null) {
    throw new Error("A personal access token is required");
  }

  return {
    statusCode: 200,
    body: createCcXmlFromGithubPersonalAccessToken(personalAccessToken)
  };
}
