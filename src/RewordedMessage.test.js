import { describe, expect, it } from "vitest";
import { RewordedMessage } from "./RewordedMessage";

describe("RewordedMessage", () => {
	it("parses valid input", () => {
		const input = `.rebase My subject\n\nThis is the body.\nSecond line.`;
		const msg = new RewordedMessage(input);
		expect(msg.subject).toBe("My subject");
		expect(msg.body).toBe("This is the body.\nSecond line.");
	});

	it("throws if not starting with .rebase", () => {
		const input = `notrebase My subject\n\nBody`;
		expect(() => new RewordedMessage(input)).toThrow(
			"Comment does not start with .rebase",
		);
	});

	it("throws if no blank line between subject and body (when body exists)", () => {
		const input = `.rebase    My subject \nBody without blank line`;
		expect(() => new RewordedMessage(input)).toThrow(
			"A blank line is needed between subject and body",
		);
	});

	it("parses subject only (no body, no blank line)", () => {
		const input = `.rebase My subject`;
		const msg = new RewordedMessage(input);
		expect(msg.subject).toBe("My subject");
		expect(msg.body).toBe("");
	});

	it("parses subject only (no body, with blank line)", () => {
		const input = `.rebase My subject\n\n   `;
		const msg = new RewordedMessage(input);
		expect(msg.subject).toBe("My subject");
		expect(msg.body).toBe("");
	});
});
