import * as core from "@actions/core";
import * as github from "@actions/github";

import { createRelease } from "./helpers";

try {
  const PAT = process.env.PAT;

  if (!PAT) {
    throw new Error("Failed reading access token");
  }

  const sourceBranchName = core.getInput("branch", { required: true });

  const octokit = github.getOctokit(PAT);

  const {
    owner,
    repo
  } = github.context.repo;
  const {
    data: tagsList
  } = await octokit.rest.repos.listTags({
    owner,
    repo,
  });
  const latestTag = tagsList?.[0];
  const previousTag = tagsList?.[1];

  if (!latestTag?.name || !previousTag?.name) {
    throw new Error("Failed reading tag names");
  }

  const release = await createRelease(
    octokit,
    sourceBranchName,
    previousTag,
    latestTag
  );

  core.setOutput("release_url", release.html_url);

  // send slack message
} catch (error: unknown) {
  core.setFailed((error as Error).message);
}
