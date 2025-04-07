# Easy release action

## Description

Action creates a release with commits comments between two latest tags. A formatted message is 
sent to a Slack channel with link to created release.

## Inputs
`branch` - the released branch with commits history.

`slack-channel`(optional) - Slack channel to post message to.  

## Env
`GITHUB_TOKEN` - automatically generated token for workflow.

`SLACK_BOT_TOKEN` - Slack bot token generated for installed Slack app

## Flow
1. Collect commits between latest two tags range.
2. Generate release with formatted message.
3. Post release notification to Slack channel.

## Usage
Please see the [release workflow](.github/workflows/release.yml) as a usage example.
