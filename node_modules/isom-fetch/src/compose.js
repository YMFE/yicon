/* eslint no-empty-function:0 */
function* noop() {}

export default (middleware) => function* exec(next) {
  if (!next) next = noop();

  let i = middleware.length;

  while (i--) {
    next = middleware[i].call(this, next);
  }

  return yield* next;
};
