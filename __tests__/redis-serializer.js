import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import redisSerializer from '../src';
import { serialize } from '../src/redis-serializer';

const getFullPath = file => path.resolve(__dirname, file);

test('Serialize data', async () => {
  const res = serialize(['set', 'testKey', 'testValueKey']);
  expect(res).toMatchSnapshot();
});

test('Stream filter and serialize', async () => {
  const readStream = fs.createReadStream(getFullPath('__fixtures__/test-data.aof'), { encoding: 'utf-8' });

  const tempPath = await fs.mkdtemp(path.join(os.tmpdir(), 'foo-'));
  const tempFilePath = path.resolve(tempPath, 'test.aof');

  try {
    await readStream
      .pipe(redisSerializer(['test3', 'stas', 'stas22']))
      .pipe(fs.createWriteStream(tempFilePath, { encoding: 'utf-8' }));

    const data = await fs.readFile(tempFilePath, 'utf-8');

    expect(data).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    expect(err).toMatch('error');
  }
});
