export const createPicturesListTemplate = (pictures) => {
  return pictures.map(({description, src}) => (`
    <img class="event__photo" src=${src} alt=${description}>
  `)).join(``);
};
