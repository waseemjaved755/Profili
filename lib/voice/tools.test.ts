import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SHARE_BOOKING_TOOL,
  assertRegisteredToolSchemas,
  buildVoiceTools,
  leaveMessageTool,
} from "./tools.ts";

test("leave_message_for_owner schema is a valid function tool", () => {
  const tool = leaveMessageTool("Ada Lovelace");
  assert.equal(tool.type, "function");
  assert.equal(tool.parameters.type, "object");
  assert.equal(tool.parameters.additionalProperties, false);
  assert.deepEqual(tool.parameters.required, ["message"]);
  assert.match(tool.description, /Ada Lovelace/);
  assertRegisteredToolSchemas([tool]);
});

test("share_booking_link has no required parameters", () => {
  assert.deepEqual(SHARE_BOOKING_TOOL.parameters.required, []);
  assert.equal(SHARE_BOOKING_TOOL.parameters.additionalProperties, false);
  assertRegisteredToolSchemas([SHARE_BOOKING_TOOL]);
});

test("booking tool is registered only with an https booking url", () => {
  const without = buildVoiceTools({ fullName: "Ada", bookingUrl: null });
  assert.deepEqual(
    without.map((tool) => tool.name),
    ["leave_message_for_owner"],
  );
  const http = buildVoiceTools({ fullName: "Ada", bookingUrl: "http://cal.com/ada" });
  assert.equal(http.length, 1);
  const https = buildVoiceTools({ fullName: "Ada", bookingUrl: "https://cal.com/ada" });
  assert.deepEqual(
    https.map((tool) => tool.name),
    ["leave_message_for_owner", "share_booking_link"],
  );
  assertRegisteredToolSchemas(https);
});
