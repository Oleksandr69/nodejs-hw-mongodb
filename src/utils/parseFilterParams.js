const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;

  const isFavour = (isFavourite) => ['true', 'false'].includes(isFavourite);
  if (isFavour(isFavourite)) return isFavourite;
};

const parseContactType = (typeValue) => {
  const isString = typeof typeValue === 'string';
  if (!isString) return;

  const isType = (typeValue) =>
    ['work', 'home', 'personal'].includes(typeValue);

  if (isType(typeValue)) return typeValue;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
  };
};
