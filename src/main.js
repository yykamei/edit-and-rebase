import * as core from "@actions/core";
import * as github from "@actions/github";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { RewordedMessage } from "./RewordedMessage";

export async function main() {
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

	const parseResult = RewordedMessage.parse(
		github.context.payload.comment.body,
	);

	if (!parseResult.success) {
		core.info(parseResult.error);
		return;
	}

	const rewordedMessage = parseResult.message;
	core.info(`Parsed subject: ${rewordedMessage.subject}`);
	core.info(`Parsed body: ${rewordedMessage.body}`);

	// OAuth device authentication
	const auth = createOAuthDeviceAuth({
		clientType: "oauth-app",
		clientId: "Ov23li8HIIAlRguBeB0e",
		scopes: ["repo"],
		onVerification(verification) {
			// Post a comment to the PR with verification URI and user code
			const octokit = github.getOctokit(core.getInput("github-token"));
			octokit.rest.issues.updateComment({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				comment_id: github.context.payload.comment.id,
				body: `Please authenticate: ${verification.verification_uri} and enter code: ${verification.user_code}

<details>
<summary>Original message</summary>
${github.context.payload.comment.body}
</details>
`,
			});
		},
	});

	const { token } = await auth({ type: "oauth" });
	core.info(`OAuth token acquired: ${token ? "yes" : "no"}`);
}
