export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  selectedImg: SelectedImgType;
  quantity: number;
  stock?: number;
};

export type SelectedImgType = {
  color?: string | null;
  colorCode?: string | null;
  image: string;
  alt: string;
};