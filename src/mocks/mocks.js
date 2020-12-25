const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const pointTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`];

const generateTypePoint = () => pointTypes[getRandomInteger(0, pointTypes.length - 1)];

export const generatePoint = () => ({
  type: generateTypePoint(),
  time: ``,
  isFavorite: Boolean(getRandomInteger()),
  destination: `London`,
  price: 400,
  id: Math.random() * (10000 - 0) + 0
});
