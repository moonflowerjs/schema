import { ValidationError } from "./errors";

describe("schema", () => {
  describe("errors", () => {
    describe("ValidationError", () => {
      it("should be instance of Error", () => {
        const err = new ValidationError("foo");

        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(TypeError);
      });

      it("should have error properties", () => {
        const err = new ValidationError("foo");

        expect(Object.getOwnPropertyNames(err).sort()).toStrictEqual([
          "errors",
          "message",
          "stack",
        ]);

        expect(String(err)).toEqual("ValidationError: foo");

        expect(err.message).toEqual("foo");
        expect(err.stack).toMatch("ValidationError: foo");
      });

      it("should have convert to JSON nicely", () => {
        const err = new ValidationError("foo");

        expect(JSON.parse(JSON.stringify(err))).toStrictEqual({
          message: "foo",
        });
      });
    });
  });
});
