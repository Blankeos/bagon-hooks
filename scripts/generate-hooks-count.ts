import fs from 'fs';
import path from 'path';

const countTsFiles = (dir: string): number => {
  let count = 0;
  const files = fs.readdirSync(dir);

  files.forEach((file: string) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      count += countTsFiles(filePath);
    } else if (file.endsWith('.ts') && !['index.ts', 'utils.ts'].includes(file)) {
      count++;
    }
  });

  return count;
};

const srcDir = path.resolve('src');
const count = countTsFiles(srcDir);

fs.writeFileSync(
  path.resolve('dev/constants/hooks-count.ts'),
  `export const HOOKS_COUNT = ${count};`,
);
