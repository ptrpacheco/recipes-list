import axios from 'axios';

const api = axios.create({ baseURL: 'https://www.themealdb.com/api/json/v1/1/' });

export const getRecipesByCategory = async (category: string) => {
  const response = await api.get(`filter.php?c=${category}`);
  return response.data.meals;
};

export const getRecipeDetails = async (id: string) => {
  const response = await api.get(`lookup.php?i=${id}`);
  return response.data.meals ? response.data.meals[0] : null;
};

export const getRecipesBySearch = async (name: string) => {
  const response = await api.get(`search.php?s=${name}`);
  return response.data.meals || [];
};

export const getRecipesByFirstLetter = async (letter: string) => {
  const response = await api.get(`search.php?f=${letter}`);
  return response.data.meals || [];
};

export const getCategoriesList = async () => {
  const response = await api.get('list.php?c=list');
  return response.data.meals || [];
};

export const getAreasList = async () => {
  const response = await api.get('list.php?a=list');
  return response.data.meals || [];
};

export const getRecipesByFilter = async (type: 'category' | 'area', value: string) => {
  const param = type === 'category' ? 'c' : 'a';
  const response = await api.get(`filter.php?${param}=${value}`);
  return response.data.meals || [];
};
