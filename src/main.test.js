import * as core from "@actions/core";
import * as github from "@actions/github";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { main } from "./main";

// Helper to mock github.context
function setGithubContext(eventName, commentBody) {
	github.context.eventName = eventName;
	github.context.payload = {
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

	it("exits if comment does not start with .rebase", () => {
		setGithubContext("issue_comment", "hello world");
		const infoSpy = vi.spyOn(core, "info");
		main();
		expect(infoSpy).toHaveBeenCalledWith("Comment does not start with .rebase");
	});
});
