export function createRandomId() {
  return (Math.random() * 10000000).toString(16).slice(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().slice(2, 7);
};