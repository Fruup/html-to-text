export const isWhiteSpace = (c: string | undefined) => !!c && /\s/.test(c);

export const center = ({ left, right }: { left: number; right: number }) =>
  Math.floor((left + right) / 2);

export const getEscapedCharacter = (text: string, index: number) => {
  // max 10 characters
  let semiColonIndex = text.slice(index, index + 10).indexOf(";");
  if (semiColonIndex === -1) return null;
  semiColonIndex += index;

  const entity = text.slice(index + 1, semiColonIndex);

  const htmlEntity = htmlEntities[entity];
  if (htmlEntity) {
    return {
      char: htmlEntity,
      length: semiColonIndex - index + 1,
    };
  }

  if (entity[0] === "#") {
    const codePoint =
      entity[1] === "x"
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(2), 10);

    if (!isNaN(codePoint)) {
      return {
        char: String.fromCodePoint(codePoint),
        length: semiColonIndex - index + 1,
      };
    }
  }

  return null;
};

const htmlEntities: Record<string, string> = {
  lt: "<",
  gt: ">",
  amp: "&",
  quot: '"',
  apos: "'",
  // nbsp: "\u00A0",
  nbsp: " ",
};
