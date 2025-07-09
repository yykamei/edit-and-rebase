import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { main } from './main';

// Helper to mock github.context
function setGithubContext(eventName, commentBody) {
  github.context.eventName = eventName;
  github.context.payload = {
    comment: commentBody !== undefined ? { body: commentBody } : undefined,
  };
}

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exits if not an issue_comment event', () => {
    setGithubContext('push');
    const infoSpy = vi.spyOn(core, 'info');
    main();
    expect(infoSpy).toHaveBeenCalledWith('Not an issue comment event, exiting');
  });

  it('exits if no comment body', () => {
    setGithubContext('issue_comment');
    const infoSpy = vi.spyOn(core, 'info');
    main();
    expect(infoSpy).toHaveBeenCalledWith('No comment body found, exiting');
  });

  it('exits if comment does not start with .rebase', () => {
    setGithubContext('issue_comment', 'hello world');
    const infoSpy = vi.spyOn(core, 'info');
    main();
    expect(infoSpy).toHaveBeenCalledWith('Comment does not start with .rebase, exiting');
  });

  it('logs rebase comment if comment starts with .rebase', () => {
    setGithubContext('issue_comment', '.rebase please');
    const infoSpy = vi.spyOn(core, 'info');
    main();
    expect(infoSpy).toHaveBeenCalledWith('Rebase comment received: .rebase please');
  });
});
