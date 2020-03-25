import { describe, it } from "mocha";
import { expect } from "chai";
import { createCcXmlFromGithubPersonalAccessToken } from ".";
import { parseStringPromise } from "xml2js";

describe("createCcXmlFromGithubPersonalAccessToken", () => {
  it("should return valid XML", async function() {
    this.timeout("10s");
    const result = await createCcXmlFromGithubPersonalAccessToken(
      process.env.PERSONAL_ACCESS_TOKEN!,
      ["joeflateau/nginx-ffmpeg-stream"]
    );
    const parsed = await parseStringPromise(result);
    expect(parsed).to.exist;
  });
});
