import slugify from 'slugify';

export const convertToSlug = (text: string) => {
  return slugify(text, {
    replacement: '-',
    lower: true,
    locale: 'vi',
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
