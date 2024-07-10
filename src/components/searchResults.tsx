import { SearchResutsProps } from "../interfaces/searchResults";
import { Product } from "../interfaces/products";
import { useEffect, useRef, useState, useCallback } from "react";
import ProductRow from "./product";
import Loader from "./loader";

export default function SearchResults({
	url,
	results,
	isPending,
	changeUrl,
}: SearchResutsProps) {
	const loaderRef = useRef<HTMLDivElement>(null);

	const [displayedResults, setDisplayedResults] = useState<Product[]>([]);
	const [skip, setSkip] = useState<number>(0);
	const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
		new Set()
	);

	const handleCheckboxChange = (id: number) => {
		const newSet = new Set(selectedProducts);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}

		setSelectedProducts(newSet);
	};

	const handleLoadMore = useCallback(() => {
		if (results.total - skip > 0 && !isPending) {
			const skipParameter = displayedResults.length;
			const urlDetails = new URL(url!);
			const baseUrl = urlDetails.origin + urlDetails.pathname;
			const urlParams = urlDetails.searchParams;
			const searchParameter = urlParams.get("q")!;
			const limitParameter = urlParams.get("limit")!;
			const newUrl = new URL(baseUrl);
			const newParams = new URLSearchParams();
			newParams.append("q", searchParameter);
			newParams.append("skip", skipParameter.toString());
			newParams.append("limit", limitParameter.toString());
			newUrl.search = newParams.toString();
			changeUrl(newUrl.toString());
		}
	}, [results.total, skip, isPending, displayedResults.length, url, changeUrl]);

	useEffect(() => {
		if (results.skip > 0) {
			setDisplayedResults((prev) => [...prev, ...results.products]);
		} else {
			setDisplayedResults(results.products);
			setSelectedProducts(new Set());
			setSkip(0);
		}
		if (results.total > results.skip) {
			setSkip((prev) => prev + results.limit);
		}
	}, [results]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				handleLoadMore();
			}
		});

		const loader = loaderRef.current;
		if (loader) {
			observer.observe(loader);
		}

		return () => {
			if (loader) {
				observer.unobserve(loader);
			}
		};
	}, [handleLoadMore]);

	return (
		<div className="results-box">
			{displayedResults.map((product) => (
				<ProductRow
					onCheck={handleCheckboxChange}
					key={product.id}
					checked={selectedProducts.has(product.id)}
					product={product}
				/>
			))}
			<div style={{ height: "1px", width: "100%" }} ref={loaderRef}>
				{isPending && <Loader />}
			</div>
		</div>
	);
}
