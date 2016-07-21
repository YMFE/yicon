import originalMulter from 'multer';

function makeGenerator(fn) {
  return (fields, fileStrategy) => function* multerGenerator(next) {
    yield new Promise((resolve, reject) => {
      fn(fields, fileStrategy)(this.req, this.res, err => (
        err ? reject(err) : resolve()
      ));
    });
    this.request.body = this.req.body;
    yield next;
  };
}

const multer = options => {
  const m = originalMulter(options);

  const _makeMiddleware = m._makeMiddleware.bind(m);
  m._makeMiddleware = makeGenerator(_makeMiddleware);

  const any = m.any.bind(m);
  m.any = makeGenerator(any);

  return m;
};

multer.diskStorage = originalMulter.diskStorage;
multer.memoryStorage = originalMulter.memoryStorage;

module.exports = multer;
