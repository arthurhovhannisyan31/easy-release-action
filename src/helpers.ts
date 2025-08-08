import * as core from "@actions/core";
import * as github from "@actions/github";

import type {
  Release,
  Tag
} from "./types";
import type { GitHub } from "@actions/github/lib/utils";

export const createRelease = async (
  octokit: InstanceType<typeof GitHub>,
  sourceBranchName: string,
  previousTag: Tag,
  latestTag: Tag,
): Promise<Release> => {
  const {
    owner,
    repo
  } = github.context.repo;
  const {
    data: commits
  } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    sha: sourceBranchName
  });

  const previousTagIndex = commits.findIndex(({
    sha
  }) => sha === previousTag.commit.sha);
  if (!Number.isFinite(previousTagIndex)) {
    throw new Error("Failed creating release. add more details");
  }
  /* Filter out merge commits from edges */
  const filteredCommits = commits.slice(1, previousTagIndex);

  const commitsNotes = filteredCommits.map(({
    commit,
    author,
  }) => {
    const firstLine = commit.message.split("\n")[0];

    return `- ${firstLine} by @${author?.login}`;
  }).join("\n");

  const {
    data: release
  } = await octokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: latestTag.name,
    name: latestTag.name,
    body: commitsNotes
  });

  core.info(`✔ Release ${release.name} created`);

  return release;
};
