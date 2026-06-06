/**
 * Extracts a specific function from Solidity source code using pattern matching and bracket balancing.
 * @param sourceCode The full Solidity source code string
 * @param functionName The name of the function to extract (e.g. "mint", "publicMint", "safeMint")
 */
export function extractSolidityFunction(sourceCode: string, functionName: string): string {
  if (!sourceCode) return '';

  // Clean the function name to get only the alphanumeric part (e.g. "claim(address,uint256)" -> "claim")
  const cleanName = functionName.split('(')[0].replace(/[^a-zA-Z0-9_]/g, '').trim();
  if (!cleanName) return '';

  let matchIndex = -1;
  const len = sourceCode.length;
  let i = 0;

  // Track comments and strings to ensure we only look at real executable code
  while (i < len) {
    const char = sourceCode[i];
    const nextChar = sourceCode[i + 1];

    // Skip single-line comments
    if (char === '/' && nextChar === '/') {
      i += 2;
      while (i < len && sourceCode[i] !== '\n' && sourceCode[i] !== '\r') {
        i++;
      }
      continue;
    }

    // Skip multi-line comments
    if (char === '/' && nextChar === '*') {
      i += 2;
      while (i < len && !(sourceCode[i] === '*' && sourceCode[i + 1] === '/')) {
        i++;
      }
      i += 2;
      continue;
    }

    // Skip single-quoted strings
    if (char === "'") {
      i++;
      while (i < len && sourceCode[i] !== "'") {
        if (sourceCode[i] === '\\') i++; // Skip escaped char
        i++;
      }
      i++;
      continue;
    }

    // Skip double-quoted strings
    if (char === '"') {
      i++;
      while (i < len && sourceCode[i] !== '"') {
        if (sourceCode[i] === '\\') i++; // Skip escaped char
        i++;
      }
      i++;
      continue;
    }

    // Check for "function" keyword in real code
    if (sourceCode.substring(i, i + 8) === 'function') {
      const remaining = sourceCode.substring(i + 8);
      // Strict regex matching whitespace, then optionally "_" and cleanName, then word boundary and whitespace/braces
      const regex = new RegExp(`^\\s+(_?${cleanName})\\b`, 'i');
      const match = regex.exec(remaining);
      if (match) {
        matchIndex = i;
        break;
      }
    }

    i++;
  }

  // If no exact match is found, let's try fallback keywords ONLY if searching for a mint-related function
  if (matchIndex === -1) {
    const isMintSearch = cleanName.toLowerCase().includes('mint');
    if (isMintSearch) {
      const fallbackKeywords = ['safeMint', 'publicMint', 'mintNFT', 'mint'];
      i = 0;
      while (i < len && matchIndex === -1) {
        const char = sourceCode[i];
        const nextChar = sourceCode[i + 1];

        if (char === '/' && nextChar === '/') {
          i += 2;
          while (i < len && sourceCode[i] !== '\n' && sourceCode[i] !== '\r') i++;
          continue;
        }
        if (char === '/' && nextChar === '*') {
          i += 2;
          while (i < len && !(sourceCode[i] === '*' && sourceCode[i + 1] === '/')) i++;
          i += 2;
          continue;
        }
        if (char === "'" || char === '"') {
          const quote = char;
          i++;
          while (i < len && sourceCode[i] !== quote) {
            if (sourceCode[i] === '\\') i++;
            i++;
          }
          i++;
          continue;
        }

        if (sourceCode.substring(i, i + 8) === 'function') {
          const remaining = sourceCode.substring(i + 8);
          for (const kw of fallbackKeywords) {
            const regex = new RegExp(`^\\s+(${kw})\\b`, 'i');
            const match = regex.exec(remaining);
            if (match) {
              matchIndex = i;
              break;
            }
          }
        }
        i++;
      }
    }
  }

  // If still no matching function can be isolated, return a clean unverified message
  if (matchIndex === -1) {
    return `// Method \`function ${cleanName}()\` is executed by this transaction,\n// but its exact implementation was not found in the verified contract source code.\n// The contract might be using inheritance, proxy interfaces, or delegate calls.`;
  }

  // Now, find the curly braces to extract the complete block
  const startOfFunc = matchIndex;
  
  // Find the first opening brace '{' after startOfFunc
  const openBraceIndex = sourceCode.indexOf('{', startOfFunc);
  if (openBraceIndex === -1) {
    // Semi-colon definition (interface/abstract contract method), look for next semicolon
    const semiColonIndex = sourceCode.indexOf(';', startOfFunc);
    if (semiColonIndex !== -1) {
      return sourceCode.substring(startOfFunc, semiColonIndex + 1).trim();
    }
    return sourceCode.substring(startOfFunc, startOfFunc + 200).trim() + '\n...';
  }

  // Track brace balance to find the closing brace of the function block
  let braceCount = 1;
  let currentIndex = openBraceIndex + 1;
  const length = sourceCode.length;

  while (braceCount > 0 && currentIndex < length) {
    const char = sourceCode[currentIndex];
    
    // Ignore characters inside strings or comments to avoid brace mismatches
    if (char === '"' || char === "'") {
      const quote = char;
      currentIndex++;
      while (currentIndex < length && sourceCode[currentIndex] !== quote) {
        if (sourceCode[currentIndex] === '\\') currentIndex++; // skip escaped char
        currentIndex++;
      }
    } else if (char === '/' && sourceCode[currentIndex + 1] === '/') {
      // Single line comment, skip to end of line
      while (currentIndex < length && sourceCode[currentIndex] !== '\n') {
        currentIndex++;
      }
    } else if (char === '/' && sourceCode[currentIndex + 1] === '*') {
      // Multi-line comment, skip to */
      currentIndex += 2;
      while (currentIndex < length && !(sourceCode[currentIndex] === '*' && sourceCode[currentIndex + 1] === '/')) {
        currentIndex++;
      }
      currentIndex++;
    } else if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    currentIndex++;
  }

  if (braceCount === 0) {
    return sourceCode.substring(startOfFunc, currentIndex).trim();
  }

  // Fallback if bracket tracking fails
  return sourceCode.substring(startOfFunc, openBraceIndex + 300).trim() + '\n\t// ... [truncated]';
}
