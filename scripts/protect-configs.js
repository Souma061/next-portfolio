const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

const configs = {
  'next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`,
  'postcss.config.mjs': `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`,
  'eslint.config.mjs': `export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "scripts/**"],
  },
];
`,
  '.npmrc': `only-built-dependencies=unrs-resolver
`
};

for (const [filename, content] of Object.entries(configs)) {
  const fullPath = path.join(root, filename);
  try {
    execSync(`attrib -r "${fullPath}"`, { stdio: 'ignore' });
  } catch (e) {}
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  try {
    execSync(`attrib +r "${fullPath}"`, { stdio: 'ignore' });
  } catch (e) {}
  console.log(`Protected ${filename} (${fs.statSync(fullPath).size} bytes, read-only)`);
}
