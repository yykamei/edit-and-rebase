import { describe, expect, it } from "vitest";
import { RewordedMessage } from "./RewordedMessage";

describe("RewordedMessage", () => {
	it("parses valid input", () => {
		const input = `.rebase My subject\n\nThis is the body.\nSecond line.`;
		const { message } = RewordedMessage.parse(input);
		expect(message.subject).toBe("My subject");
		expect(message.body).toBe("This is the body.\nSecond line.");
	});

	it("returns error if not starting with .rebase", () => {
		const input = `notrebase My subject\n\nBody`;
		const result = RewordedMessage.parse(input);
		expect(result.success).toBe(false);
		expect(result.error).toBe("Comment does not start with .rebase");
	});

	it("returns error if no blank line between subject and body (when body exists)", () => {
		const input = `.rebase    My subject \nBody without blank line`;
		const result = RewordedMessage.parse(input);
		expect(result.success).toBe(false);
		expect(result.error).toBe(
			"A blank line is needed between subject and body",
		);
	});

	it("parses subject only (no body, no blank line)", () => {
		const input = `.rebase My subject`;
		const { message } = RewordedMessage.parse(input);
		expect(message.subject).toBe("My subject");
		expect(message.body).toBe("");
	});

	it("parses subject only (no body, with blank line)", () => {
		const input = `.rebase My subject\n\n   `;
		const { message } = RewordedMessage.parse(input);
		expect(message.subject).toBe("My subject");
		expect(message.body).toBe("");
	});
});
