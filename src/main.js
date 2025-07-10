import * as core from "@actions/core";
import * as github from "@actions/github";
import { RewordedMessage } from "./RewordedMessage";

export function main() {
	// Check if this is an issue comment event
	if (github.context.eventName !== "issue_comment") {
		core.info("Not an issue comment event, exiting");
		return;
	}

	const commentBody = github.context.payload.comment.body;

	// Parse the comment using RewordedMessage
	let rewordedMessage;
	try {
		rewordedMessage = new RewordedMessage(commentBody);
	} catch (error) {
		core.info(error.message);
		return;
	}
	core.info(`Parsed subject: ${rewordedMessage.subject}`);
	core.info(`Parsed body: ${rewordedMessage.body}`);
}
