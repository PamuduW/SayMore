module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals", // Next.js recommended ESLint config
    "prettier", // Disables ESLint rules that conflict with Prettier
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error", // Shows Prettier issues as ESLint errors
    "no-unused-vars": "warn", // Warn for unused variables instead of error
    "no-console": "warn", // Warn instead of error for console logs
  },
};
