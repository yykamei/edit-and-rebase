export class RewordedMessage {
	constructor(subject, body) {
		this.subject = subject;
		this.body = body;
	}

	static parse(input) {
		if (!input.startsWith(".rebase")) {
			return { success: false, error: "Comment does not start with .rebase" };
		}

		const lines = input.split("\n");
		const subject = lines[0].replace(/^\.rebase\s+/, "").trim();

		if (lines.length === 2) {
			return {
				success: false,
				error: "A blank line is needed between subject and body",
			};
		}

		const body = lines.length > 1 ? lines.slice(2).join("\n").trim() : "";

		return {
			success: true,
			message: new RewordedMessage(subject, body),
		};
	}
}
