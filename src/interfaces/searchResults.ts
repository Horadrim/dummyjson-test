import { ProductsResponse } from "./products";

export interface SearchResutsProps {
	url: string | null;
	results: ProductsResponse;
	isPending: boolean;
	changeUrl: (url: string | null) => void;
}
