import path from 'path';
import genDiff from '../src';

test('Add values', () => {
  const delim = path.sep;
  let fixturesPath = __dirname.split(delim);
  fixturesPath.pop();
  fixturesPath = path.resolve(fixturesPath.join(delim), 'fixtures');

  const pathFileBefore = path.resolve(fixturesPath, 'structBefore.json');
  const pathFileAfter = path.resolve(fixturesPath, 'structAddAfter.json');

  const testResult = `{
    beforeValue: beforeValue
    beforeValue1: beforeValue1
    beforeValue2: beforeValue2
  + valueString: value1
  + valueNumber: 22
}`;

  expect(genDiff(pathFileBefore, pathFileAfter)).toBe(testResult);
});
