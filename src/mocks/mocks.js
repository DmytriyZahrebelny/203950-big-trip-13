const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const pointTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`];
const priceList = [400, 600, 500, 800, 700];

const generateTypePoint = () => pointTypes[getRandomInteger(0, pointTypes.length - 1)];

export const generatePoint = (i) => ({
  type: generateTypePoint(),
  time: ``,
  isFavorite: Boolean(getRandomInteger()),
  destination: `London`,
  price: priceList[i],
  id: Math.random() * (10000 - 0) + 0
});
