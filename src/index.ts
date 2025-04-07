import * as core from "@actions/core";
import * as github from "@actions/github";
import { WebClient } from "@slack/web-api";

import { createRelease } from "./helpers";

try {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

  if (!GITHUB_TOKEN || !SLACK_BOT_TOKEN) {
    throw new Error("Failed reading required tokens");
  }

  const sourceBranchName = core.getInput("branch", { required: true });
  const slackChannel = core.getInput("slack-channel", { required: false });

  const octokit = github.getOctokit(GITHUB_TOKEN);
  const slackClient = new WebClient(SLACK_BOT_TOKEN);

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

  if (slackChannel) {
    const result = await slackClient.chat.postMessage({
      blocks: [{
        type: "header",
        text: {
          type: "plain_text",
          text: "Release created:"
        }
      }, {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${release.html_url}|${release.name}> is ready!`,
        }
      }],
      channel: slackChannel,
    });

    core.info(`✔ Slack message posted: ${result.message?.text}`);
  }
} catch (error: unknown) {
  core.setFailed((error as Error).message);
}
