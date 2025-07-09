import * as core from "@actions/core";
import * as github from "@actions/github";

function main() {
    // Check if this is an issue comment event
    if (github.context.eventName !== 'issue_comment') {
        core.info('Not an issue comment event, exiting');
        return;
    }

    // Get the comment body from the payload
    const comment = github.context.payload.comment;
    if (!comment || !comment.body) {
        core.info('No comment body found, exiting');
        return;
    }

    const commentBody = comment.body;
    
    // Check if comment starts with .rebase
    if (!commentBody.startsWith('.rebase')) {
        core.info('Comment does not start with .rebase, exiting');
        return;
    }

    // Log the whole comment
    core.info(`Rebase comment received: ${commentBody}`);
}

try {
    main();
} catch (error) {
    core.setFailed(error.message);
}
