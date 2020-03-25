import { createCcXmlFromGithubPersonalAccessToken } from "..";

export async function handler(event: {
  queryStringParameters: { personalAccessToken?: string };
  pathParameters: {
    owner: string;
    repo: string;
  };
}) {
  const { personalAccessToken } = event.queryStringParameters;
  const { owner, repo } = event.pathParameters;

  if (personalAccessToken == null) {
    throw new Error("A personal access token is required");
  }

  return {
    statusCode: 200,
    body: await createCcXmlFromGithubPersonalAccessToken({
      personalAccessToken,
      owner,
      name: repo
    })
  };
}
