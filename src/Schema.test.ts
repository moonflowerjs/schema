import Schema from "./Schema";
import { ValidationError } from "./schema/errors";
import { typeCheck } from "./schema/utils";

describe('Schema', () => {
  describe('()', () => {
    it('validate string', () => {
      const validator = Schema('foo' as const);

      typeCheck<typeof validator, (x: 'foo') => 'foo'>('ok');
      expect(validator('foo')).toEqual('foo');
      expect(() => validator(-1 as any)).toThrow(ValidationError);
    });


    it('custom message', () => {
      const validator = Schema('foo' as const, 'test error');

      expect(() => validator(-1 as any)).toThrowError(new ValidationError('test error'));
    });
  })
})