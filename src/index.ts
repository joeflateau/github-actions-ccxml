import { Octokit } from "@octokit/rest";
import { Builder } from "xml2js";

export async function createCcXmlFromGithubPersonalAccessToken({
  owner,
  name,
  personalAccessToken
}: {
  owner: string;
  name: string;
  personalAccessToken: string;
}) {
  const octokit = new Octokit({
    auth: personalAccessToken
  });

  const ccXml: CcXmlRoot = {
    Projects: {
      Project: [{ $: await loadRepoBuildStatus({ octokit, owner, name }) }]
    }
  };
  const builder = new Builder();
  return builder.buildObject(ccXml);
}

async function loadRepoBuildStatus({
  octokit,
  owner,
  name
}: {
  octokit: Octokit;
  owner: string;
  name: string;
}) {
  const {
    data: { workflow_runs: runs }
  } = await octokit.actions.listRepoWorkflowRuns({
    owner: owner,
    repo: name
  });
  const repo = `${owner}/${name}`;

  const lastRun = runs.find(run => run.conclusion != null);

  const status: CcXmlProjectAttributes = {
    name: repo,
    webUrl: `https://github.com/${repo}`,
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
