import { faker } from '@faker-js/faker';
import { Wallpaper, Category } from '../types';

// Categorías brutales
const categories = ['ABSTRACT', 'NATURE', 'URBAN', 'MINIMAL', 'COLORFUL', 'DARK'];

// URLs de wallpapers de ejemplo (usando placeholders diversos)
const getWallpaperUrl = (width: number, height: number, category: string) => {
  const colors = ['FF00FF', '00FF00', 'FFFF00', '00FFFF', 'FF0000', '000000'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://img-wrapper.vercel.app/image?url=https://placehold.co/${width}x${height}/${color}/FFFFFF?text=${category.toUpperCase()}`;
};

// Generar wallpapers mock
export const generateMockWallpapers = (count: number): Wallpaper[] => {
  return Array.from({ length: count }, () => {
    const category = faker.helpers.arrayElement(categories);
    const width = faker.helpers.arrayElement([1920, 2560, 3840]);
    const height = faker.helpers.arrayElement([1080, 1440, 2160]);
    
    return {
      id: faker.string.uuid(),
      title: `${category} ${faker.number.int({ min: 1, max: 999 })}`,
      category,
      url: getWallpaperUrl(width, height, category),
      resolution: `${width}x${height}`,
      downloads: faker.number.int({ min: 50, max: 50000 }),
      likes: faker.number.int({ min: 5, max: 5000 }),
      isLiked: faker.datatype.boolean()
    };
  });
};

export const mockCategories: Category[] = categories.map(cat => ({
  id: cat.toLowerCase(),
  name: cat,
  count: faker.number.int({ min: 20, max: 150 })
}));

export const mockWallpapers = generateMockWallpapers(36);
