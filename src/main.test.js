import * as core from "@actions/core";
import * as github from "@actions/github";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { main } from "./main";

// Helper to mock github.context
function setGithubContext(eventName, commentBody, isPullRequest = true) {
	github.context.eventName = eventName;
	const issue = isPullRequest ? { pull_request: {}, number: 1 } : { number: 1 };
	github.context.payload = {
		issue,
		comment: commentBody !== undefined ? { body: commentBody } : undefined,
	};
}

describe("main", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exits if not an issue_comment event", () => {
		setGithubContext("push");
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Not an issue comment event, exiting");
	});

	it("exits if comment is not on a pull request", () => {
		setGithubContext("issue_comment", "hello world", false);
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Comment is not on a pull request, exiting");
	});

	it("exits if comment does not start with .rebase", () => {
		setGithubContext("issue_comment", "hello world");
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Comment does not start with .rebase");
	});
});
