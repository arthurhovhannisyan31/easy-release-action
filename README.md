<div align="center">
  <h1><code>easy-release-action</code></h1>
</div>


# Easy release action

## Description

Easy Release Action is a GitHub Action that creates a release by collecting commit messages between the 
latest two tags on a given branch. It generates a formatted release message and posts it to a Slack channel. 
It requires GITHUB_TOKEN, and optionally SLACK_BOT_TOKEN and SLACK_CHANNEL. 
Example usage is available in the release workflow.

## Inputs
`branch` - the released branch with commits history

## Env
`GITHUB_TOKEN` - automatically generated token for workflow

`SLACK_BOT_TOKEN`(optional) - Slack bot token generated for installed Slack app

`SLACK_CHANNEL`(optional) - Slack channel id to post messages to

## Flow
1. Collect commits between latest two tags range
2. Generate release with formatted message
3. Post release notification to Slack channel

## Usage
Please see the [release workflow](.github/workflows/release.yml) as a usage example.
