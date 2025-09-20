# html-to-text

A zero-dependency TypeScript library for converting HTML to text while preserving source mapping. This library strips HTML tags, handles HTML entities, and provides a source map that allows you to trace back from positions in the converted text to the original HTML source.

## Features

- 🚀 Zero dependencies
- 📍 Source mapping support - trace text positions back to original HTML
- 🔤 HTML entity decoding (e.g., `&lt;` → `<`)
- 🎛️ Configurable whitespace handling
- 💪 TypeScript support with full type definitions
- 🔍 Built-in search utilities with source mapping

## Installation

```bash
npm install @leonsh/html-to-text
```

## Usage

### Basic Usage

```typescript
import { htmlToText } from "@leonsh/html-to-text";

const result = htmlToText("<div>Hello <strong>world</strong>!</div>");

console.log(result.output); // "Hello world!"
console.log(result.map); // [[5, 0], [19, 6], [33, 11]]
```

### Options

The `htmlToText` function accepts an optional options object:

```typescript
const result = htmlToText(html, {
  preserveHtmlEntities: false, // Default: false - decode HTML entities
  preserveWhiteSpace: false, // Default: false - normalize whitespace
});
```

### Working with Source Maps

The source map allows you to trace positions in the converted text back to the original HTML:

```typescript
const html = "<div>Hello <em>beautiful</em> world!</div>";
const result = htmlToText(html);

console.log(result.output); // "Hello beautiful world!"

// Find where "beautiful" starts in the output
const textIndex = result.output.indexOf("beautiful"); // 6

// Resolve back to original HTML position
const sourceIndex = result.resolveIndex(textIndex);
console.log(sourceIndex); // [15, 6] - position 15 in HTML maps to position 6 in text
```

## API Reference

### `htmlToText(input, options?)`

Converts HTML to text with source mapping.

**Parameters:**

- `input: string` - The HTML string to convert
- `options?: object` - Optional configuration
  - `preserveHtmlEntities?: boolean` - Keep HTML entities encoded (default: `false`)
  - `preserveWhiteSpace?: boolean` - Preserve original whitespace (default: `false`)

**Returns:** `HtmlToTextResult`

### `HtmlToTextResult`

The result object containing the converted text and source map utilities.

**Properties:**

- `input: string` - Original HTML input
- `output: string` - Converted text output
- `map: SourceMap` - Array of `[inputIndex, outputIndex]` tuples

**Methods:**

- `matchAll(regex: RegExp)` - Search the output text and return matches with indices
- `resolveIndex(index: number)` - Find the source map entry for a given output position

### Type Definitions

```typescript
type SourceMap = [inputIndex: number, outputIndex: number][];
```

## License

MIT
