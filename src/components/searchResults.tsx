import { SearchResutsProps } from "../interfaces/searchResults";
import { Product } from "../interfaces/products";
import { useEffect, useRef, useState } from "react";
import ProductRow from "./product";
import Loader from "./loader";

export default function SearchResults({
	url,
	results,
	isPending,
	changeUrl,
}: SearchResutsProps) {
	const loaderRef = useRef(null);

	const [displayedResults, setDisplayedResults] = useState<Product[]>([]);

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

	const handleLoadMore = () => {
		const hasMore = results.total - results.skip > 0;

		if (hasMore) {
			const skipParameter = displayedResults.length;
			const urlDetails = new URL(url!);
			const baseUrl = urlDetails.origin + urlDetails.pathname;
			const urlParams = urlDetails.searchParams;
			const searchParameter = urlParams.get("q");
			const limitParameter = urlParams.get("limit");
			const newUrl = new URL(baseUrl);
			const newParams = new URLSearchParams();
			newParams.append("q", searchParameter!);
			newParams.append("skip", skipParameter!.toString());
			newParams.append("limit", limitParameter!.toString());
			newUrl.search = newParams.toString();
			changeUrl(newUrl.toString());
		}
	};

	useEffect(() => {
		const skip = results?.skip ?? 0;

		if (skip > 0) {
			setDisplayedResults((prev) => [...prev, ...results.products]);
		} else {
			setDisplayedResults([...results.products]);
			setSelectedProducts(new Set());
		}

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
	}, [results]);

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
