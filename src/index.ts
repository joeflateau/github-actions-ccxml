import { Octokit } from "@octokit/rest";
import { Builder } from "xml2js";

export async function createCcXmlFromGithubPersonalAccessToken(
  personalAccessToken: string,
  repoNames: string[]
) {
  const octokit = new Octokit({
    auth: personalAccessToken
  });
  const repos = await getRepos(octokit);
  const ccXml: CcXmlRoot = {
    Projects: {
      Project: (
        await Promise.all(
          repos
            .filter(({ owner, name }) => repoNames.includes(`${owner}/${name}`))
            .map(async repo => await loadRepoBuildStatus(octokit, repo))
        )
      )
        .filter(project => project != null)
        .map(project => ({ $: project! }))
    }
  };
  const builder = new Builder();
  return builder.buildObject(ccXml);
}

async function getRepos(octokit: Octokit): Promise<GhRepo[]> {
  const response = await octokit.repos.listForAuthenticatedUser({
    per_page: 100
  });
  return (response.data as any[]).map(
    ({ id, name, owner: { login: owner }, html_url }) => ({
      id,
      name,
      owner,
      html_url
    })
  );
}

async function loadRepoBuildStatus(
  octokit: Octokit,
  { owner, name, html_url }: GhRepo
) {
  try {
    const {
      data: { workflow_runs: runs }
    } = await octokit.actions.listRepoWorkflowRuns({
      owner: owner,
      repo: name
    });

    if (runs.length === 0) {
      return null;
    }

    const lastRun = runs.find(run => run.conclusion != null);

    const status: CcXmlProjectAttributes = {
      name: `${owner}/${name}`,
      webUrl: html_url,
      activity: runs.some(run => run.conclusion == null)
        ? "Building"
        : "Sleeping",
      lastBuildLabel: lastRun?.id.toString() ?? "",
      lastBuildStatus:
        (lastRun?.conclusion as null | string) === "success"
          ? "Success"
          : "Failure",
      lastBuildTime: lastRun?.created_at ?? ""
    };
    return status;
  } catch (err) {
    throw err;
  }
}

interface GhRepo {
  id: number;
  owner: string;
  name: string;
  html_url: string;
}

type CcXmlActivity = "Sleeping" | "Building" | "CheckingModifications";

type CcXmlBuildStatus =
  | "Pending"
  | "Success"
  | "Failure"
  | "Exception"
  | "Unknown";

type CcXmlRoot = {
  Projects: { Project: { $: CcXmlProjectAttributes }[] };
};

interface CcXmlProjectAttributes {
  name: string;
  activity: CcXmlActivity;
  lastBuildStatus: CcXmlBuildStatus;
  lastBuildLabel: string;
  lastBuildTime: string;
  webUrl: string;
}
