const { subtract, add } = require('./crypto');

test('adds 1 and 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('subtracts 3 and 2 to equal 1', () => {
  expect(subtract(3, 2)).toBe(1);
});
