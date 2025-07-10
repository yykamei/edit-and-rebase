import * as core from "@actions/core";
import * as github from "@actions/github";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { main } from "./main";
import { createOAuthDeviceAuth as importedCreateOAuthDeviceAuth } from "@octokit/auth-oauth-device";

// Helper to mock github.context
function setGitHubContext(eventName, commentBody, isPullRequest = true) {
	github.context.eventName = eventName;
	const issue = isPullRequest ? { pull_request: {}, number: 123 } : { number: 1 };
	github.context.payload = {
		issue,
		comment: commentBody !== undefined ? { id: 8834, body: commentBody } : undefined,
	};
}

vi.mock("@octokit/auth-oauth-device");

describe("main", () => {
	let originalGithubRepository;
	beforeEach(() => {
		originalGithubRepository = process.env.GITHUB_REPOSITORY;
		process.env.GITHUB_REPOSITORY = "dummy-owner/dummy-repo";
		vi.clearAllMocks();
	});
	afterEach(() => {
		process.env.GITHUB_REPOSITORY = originalGithubRepository;
	});

	it("exits if not an issue_comment event", () => {
		setGitHubContext("push");
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Not an issue comment event, exiting");
	});

	it("exits if comment is not on a pull request", () => {
		setGitHubContext("issue_comment", "hello world", false);
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Comment is not on a pull request, exiting");
	});

	it("exits if comment does not start with .rebase", () => {
		setGitHubContext("issue_comment", "hello world");
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Comment does not start with .rebase");
	});

	it("performs OAuth device authentication and posts verification comment", async () => {
		setGitHubContext("issue_comment", ".rebase subject\n\nbody");
		const infoSpy = vi.spyOn(core, "info");
		vi.spyOn(core, "getInput").mockReturnValue("dummy-token");
		const updateCommentMock = vi.fn();
		vi.spyOn(github, "getOctokit").mockReturnValue({ issues: { updateComment: updateCommentMock } });

		const verification = {
			verification_uri: "https://github.com/login/device",
			user_code: "123-456",
		};

		const authMock = vi.fn().mockImplementation(async () => {
			return { token: "dummy-oauth-token" };
		});
		importedCreateOAuthDeviceAuth.mockImplementation((opts) => {
			opts.onVerification(verification);
			return authMock;
		});

		await main();
		expect(updateCommentMock).toHaveBeenCalledWith({
			owner: "dummy-owner",
			repo: "dummy-repo",
			issue_number: 123,
			comment_id: 8834,
			body: expect.stringContaining(verification.verification_uri),
		});
		expect(infoSpy).toHaveBeenCalledWith("OAuth token acquired: yes");
	});
});
