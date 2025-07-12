/**
 * @description перевірити чи клавіша є Space
 * @param key назва клавіши
 * @returns якщо клавіша Space - return 'Space', ні - оригінальну назву клввіши
 */
export const interceptSpaceKey = (key: string): string => key === ' ' ? 'Space' : key;  
