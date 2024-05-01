import { ItemCategory, CategoryMap } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const categoryMap: CategoryMap = {
  [ItemCategory.Soft]: 'soft',
  [ItemCategory.Hard]: 'hard',
  [ItemCategory.Additional]: 'additional',
  [ItemCategory.Other]: 'other',
  [ItemCategory.Button]: 'button',
};

