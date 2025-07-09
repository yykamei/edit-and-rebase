import * as core from '@actions/core';
import * as github from '@actions/github';

try {
    core.info("Hello");
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    core.info(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
//# sourceMappingURL=index.js.map
