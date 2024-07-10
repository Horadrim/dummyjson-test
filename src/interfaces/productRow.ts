import { Product } from "./products";

export interface ProductRowProps {
	product: Product;
	checked: boolean;
	onCheck: (id: number) => void;
}
