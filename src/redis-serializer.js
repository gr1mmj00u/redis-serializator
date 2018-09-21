import Parser from 'redis-parser';
import through2 from 'through2';

const excludedCmd = ['SET', 'SETNX'];

const replyArray = [];

const parser = new Parser({
  returnReply(reply) {
    replyArray.push(reply);
  },
  returnError(err) {
    throw err;
  },
  returnFatalError(err) {
    throw err;
  },
});

export const serialize = (arr = []) => {
  if (arr.length === 0) {
    return '';
  }

  const res = arr.reduce((acc, e) => [...acc, `$${e.length}`, e], []);

  return [`*${arr.length}`, ...res].join('\n');
};

const filter = keys => through2((data, enc, cb) => {
  parser.execute(data);

  const filteredReply = replyArray.filter(([cmd, k]) => !(excludedCmd.includes(cmd.toUpperCase())
        && keys.includes(k)));

  const result = filteredReply
    .reduce((acc, e) => [...acc, serialize(e)], [])
    .join('\n');

  cb(null, Buffer.from(result));
});

export default filter;
