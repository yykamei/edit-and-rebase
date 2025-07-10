import * as core from "@actions/core";
import * as github from "@actions/github";
import { RewordedMessage } from "./RewordedMessage";

export function main() {
	if (github.context.eventName !== "issue_comment") {
		core.info("Not an issue comment event, exiting");
		return;
	}

	// Check if the comment is on a pull request
	const issue = github.context.payload.issue;
	if (!issue || !issue.pull_request) {
		core.info("Comment is not on a pull request, exiting");
		return;
	}

	const commentBody = github.context.payload.comment.body;
	const parseResult = RewordedMessage.parse(commentBody);

	if (!parseResult.success) {
		core.info(parseResult.error);
		return;
	}

	const rewordedMessage = parseResult.message;
	core.info(`Parsed subject: ${rewordedMessage.subject}`);
	core.info(`Parsed body: ${rewordedMessage.body}`);
}
