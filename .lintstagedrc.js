module.exports = {
  '*.{js,ts,json}': ['eslint --fix', 'prettier --write', () => 'tsc --noEmit'],
  // '*': 'vitest related --run',
};
