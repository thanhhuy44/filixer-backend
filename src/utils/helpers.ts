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

// utils/buildMongoFilters.ts

export function buildMongoFilters(query: {
  [key: string]: any;
}): Record<string, any> {
  const filters: Record<string, any> = {};

  for (const key in query) {
    const value = query[key];

    // Skip pagination params if included in same query object
    if (['page', 'limit', 'sortBy', 'sortDirection'].includes(key)) continue;

    // Boolean check
    if (value === 'true' || value === true) {
      filters[key] = true;
    } else if (value === 'false' || value === false) {
      filters[key] = false;
    }

    // Number check
    else if (!isNaN(value) && value !== '') {
      filters[key] = Number(value);
    }

    // Default to string regex search
    else if (typeof value === 'string') {
      filters[key] = { $regex: value, $options: 'i' };
    }
  }

  return filters;
}
