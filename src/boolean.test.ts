import { typeCheck } from "./schema/utils";
import boolean from "./boolean";
import { ValidationError } from "./schema/errors";

describe("boolean", () => {
  it("Types", () => {
    typeCheck<ReturnType<typeof boolean>, boolean>("ok");
    typeCheck<Parameters<typeof boolean>, [boolean]>("ok");
  });

  it("()", () => {
    const res = boolean(true);
    typeCheck<typeof res, boolean>("ok");

    expect(boolean(true)).toEqual(true);
    expect(boolean(false)).toEqual(false);

    expect(() => boolean("true" as any)).toThrow(ValidationError);
    expect(() => boolean(0 as any)).toThrow(ValidationError);
    expect(() => boolean(1 as any)).toThrow(ValidationError);
    expect(() => boolean(0.5 as any)).toThrow(ValidationError);
    expect(() => boolean(1.2 as any)).toThrow(ValidationError);

    expect(() => boolean({} as any)).toThrow(ValidationError);
    expect(() => boolean("hel" as any)).toThrow(ValidationError);
    expect(() => boolean(["hel"] as any)).toThrow(ValidationError);
    expect(() => boolean(null as any)).toThrow(ValidationError);
    expect(() => boolean(undefined as any)).toThrow(ValidationError);
  });

  it(".equals()", () => {
    const trueType = boolean.equals(true);
    typeCheck<ReturnType<typeof trueType>, true>("ok");
    typeCheck<Parameters<typeof trueType>, [boolean]>("ok");

    expect(boolean.equals(true)(true)).toEqual(true);
    expect(boolean.equals(false)(false)).toEqual(false);

    expect(() => boolean.equals(true)(false)).toThrow(ValidationError);
    expect(() => boolean.equals(false)(true)).toThrow(ValidationError);

    expect(() => boolean.equals(true)(1 as any)).toThrow(ValidationError);
    expect(() => boolean.equals(false)(0 as any)).toThrow(ValidationError);
  });
});
