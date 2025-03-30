/**
 * Prettier configuration file
 * @type {Object}
 * @property {string} arrowParens - Include parentheses around a sole arrow function parameter.
 * @property {boolean} bracketSameLine - Put the `>` of a multi-line JSX element at the end of the last line.
 * @property {boolean} bracketSpacing - Print spaces between brackets in object literals.
 * @property {boolean} singleQuote - Use single quotes instead of double quotes.
 * @property {string} trailingComma - Print trailing commas wherever possible in multi-line comma-separated syntactic structures.
 * @property {number} printWidth - Specify the line length that the printer will wrap on.
 * @property {number} tabWidth - Specify the number of spaces per indentation-level.
 * @property {boolean} semi - Print semicolons at the ends of statements.
 * @property {string} endOfLine - Specify the end of line character.
 */
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  endOfLine: 'lf',
};
