import { describe, it } from "mocha";
import { expect } from "chai";
import { createCcXmlFromGithubPersonalAccessToken } from ".";
import { parseStringPromise } from "xml2js";

describe("createCcXmlFromGithubPersonalAccessToken", () => {
  it("should return valid XML", async function() {
    this.timeout("10s");
    const result = await createCcXmlFromGithubPersonalAccessToken({
      personalAccessToken: "",
      owner: "github",
      name: "actions-cheat-sheet"
    });
    const parsed = await parseStringPromise(result);
    expect(parsed).to.exist;
  });
});
