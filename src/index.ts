import { center, getEscapedCharacter, isWhiteSpace } from "./helpers";

export function htmlToText(
  input: string,
  options: {
    preserveHtmlEntities?: boolean;
    preserveWhiteSpace?: boolean;
  } = {}
) {
  let output = "";
  let isTag = false;

  const map: SourceMap = [];

  if (!!input[0] && input[0] !== "<") {
    map.push([0, 0]);
  }

  for (let i = 0; i < input.length; i++) {
    const c = input[i]!;

    if (!options.preserveHtmlEntities && c === "&") {
      const escaped = getEscapedCharacter(input, i);
      if (escaped) {
        output += escaped.char;
        i += escaped.length - 1;
        continue;
      }
    }

    if (c === "<") {
      isTag = true;
    } else if (c === ">") {
      isTag = false;

      if (i + 1 < input.length) {
        map.push([i + 1, output.length]);
      }
    } else {
      if (!isTag) {
        if (!options.preserveWhiteSpace && isWhiteSpace(c)) {
          if (!isWhiteSpace(output.at(-1))) {
            output += " ";
          }
        } else {
          output += c;
        }
      }
    }
  }

  return new HtmlToTextResult(input, output, map);
}

export class HtmlToTextResult {
  constructor(
    readonly input: string,
    readonly output: string,
    readonly map: SourceMap
  ) {}

  matchAll(regex: RegExp) {
    return Array.from(this.output.matchAll(regex)).map(
      ({ "0": match, index }) => ({
        index,
        match,
      })
    );
  }

  /**
   * Finds the source map entry for the given output index.
   */
  resolveIndex(
    /**
     * Index into the output string for which to find the corresponding input index.
     */
    index: number,
    /**
     * **INTERNAL**
     *
     * The bounding indices used for binary search.
     */
    indices?: { left: number; right: number }
  ): SourceMap[number] {
    const map = this.map;

    indices ??= { left: 0, right: map.length - 1 };

    if (indices.left === indices.right) return map[indices.left]!;

    const pivotIndex = center(indices);

    const a = map[pivotIndex]![1];
    const b = map[pivotIndex + 1]?.[1];

    if (index < a) {
      return this.resolveIndex(index, {
        left: indices.left,
        right: pivotIndex,
      });
    } else if (b == null) {
      return map[pivotIndex]!;
    } else if (index > b) {
      return this.resolveIndex(index, {
        left: pivotIndex,
        right: indices.right,
      });
    } else {
      return map[pivotIndex]!;
    }
  }
}

export type SourceMap = [inputIndex: number, outputIndex: number][];
