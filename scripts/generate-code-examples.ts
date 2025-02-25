import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function transformContent(sourceContent: string, functionName: string) {
  let lines = sourceContent.split('\n');
  let finalLines: string[] = [];

  let posInExampleBase: 'opening' | 'inside' | 'none' = 'none';

  // Process content, import by import and content
  for (const line of lines) {
    // Process imports
    if (line.includes('import')) {
      if (line.includes("'src'")) {
        finalLines.push(line.replace(/from 'src'/, "from 'bagon-hooks'"));
      } else if (line.includes("'solid-js'") || line.includes("'solid-js/store'")) {
        finalLines.push(line);
      }
      continue;
    }

    if (line.includes('// @ts-ignore')) continue;
    if (line.includes('const components: any = useMDXComponents();')) continue;
    if (line.includes('<ExampleBase')) {
      posInExampleBase = 'opening';
      continue;
    }

    if (posInExampleBase === 'opening') {
      if (line.trim() === '>') {
        posInExampleBase = 'inside';
      }
      continue;
    }
    if (posInExampleBase === 'inside') {
      if (line.includes('</ExampleBase>')) {
        posInExampleBase = 'none';
        continue;
      }
    }

    finalLines.push(line);
  }

  // Build the complete function
  const functionContent = finalLines.join('\n');
  // Wrap in code block
  const mdxContent = '```tsx\n' + functionContent + '\n```';

  return mdxContent;
}

function generateExampleFile(
  filePath: string,
  outputFilePath: string = 'scripts/unknown-hook.code.mdx',
) {
  // Read the source file
  const sourceContent = fs.readFileSync(filePath, 'utf8');

  // Get the base filename without extension
  const baseFilename = path.basename(filePath, path.extname(filePath)).replace('.example', '');
  const functionName =
    baseFilename
      .replace(/-(\w)/g, (_, c) => c.toUpperCase())
      .replace(/^(\w)/, (_, c) => c.toUpperCase()) + 'Example';

  // Split content into lines
  const mdxContent = transformContent(sourceContent, functionName);

  // Write to output file
  fs.writeFileSync(outputFilePath, mdxContent);
}

// Example usage
// const inputPath = path.resolve('dev/components/examples/use-hotkeys/use-hotkeys.example.tsx');
// const inputPath = path.resolve('dev/components/examples/use-toggle/use-toggle.example.tsx');
// console.log('Processing:', inputPath);
// generateExampleFile(inputPath);

// ===========================================================================
// Generate and Format.
// ===========================================================================
const EXAMPLES_DIR = path.resolve('dev/components/examples');
const hookExampleDirs = fs.readdirSync(EXAMPLES_DIR);
hookExampleDirs.forEach(hookExampleDir => {
  // To ignore:
  if (hookExampleDir === 'example-base.tsx') {
    return;
  }

  // To generate for:
  fs.readdir(path.resolve(EXAMPLES_DIR, hookExampleDir), null, (err, files) => {
    const sourceFilename = `${hookExampleDir}.example.tsx`;
    const sourceFilePath = path.resolve(EXAMPLES_DIR, hookExampleDir, sourceFilename);

    const mdxFilename = `${hookExampleDir}.code.mdx`;
    const mdxFilePath = path.resolve(EXAMPLES_DIR, hookExampleDir, mdxFilename);

    generateExampleFile(sourceFilePath, mdxFilePath);
  });
});

// Format the file with Prettier
try {
  const globToFormat = `${path.resolve(EXAMPLES_DIR)}/**/*.code.mdx`;
  execSync(`bunx prettier --write "${globToFormat}"`, {
    stdio: 'inherit',
  });
  console.log(`Formatted "${globToFormat}" with Prettier`);
} catch (error) {
  console.error('Error formatting with Prettier:', error);
}
