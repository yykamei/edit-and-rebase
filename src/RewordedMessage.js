export class RewordedMessage {
	constructor(input) {
		if (!input.startsWith(".rebase")) {
			throw new Error("Comment does not start with .rebase");
		}

		const lines = input.split("\n");
		const subject = lines[0].replace(/^\.rebase\s+/, "").trim();

		if (lines.length === 2) {
			throw new Error("A blank line is needed between subject and body");
		}

		if (lines.length === 1) {
			this.subject = subject;
			this.body = "";
		} else {
			this.subject = subject;
			this.body = lines.slice(2).join("\n").trim();
		}
	}
}
