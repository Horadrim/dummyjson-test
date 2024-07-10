import { useState } from "react";
import SearchBox from "./components/searchBox";
import SearchResults from "./components/searchResults";
import { ProductsResponse } from "./interfaces/products";
import { useFetch } from "./hooks/useFetch";
import "./styles/App.css";

function App() {
	const baseUrl = "https://dummyjson.com/products/";
	const fetchLimit = 10;
	const [url, setUrl] = useState<string | null>(null);
	const { data, isPending, error } = useFetch(url);

	return (
		<div className="container">
			<SearchBox baseUrl={baseUrl} fetchLimit={fetchLimit} changeUrl={setUrl} />

			{error && <span className="error">{error}</span>}
			{!!data && (
				<SearchResults
					url={url}
					results={data as ProductsResponse}
					isPending={isPending}
					changeUrl={setUrl}
				/>
			)}
		</div>
	);
}

export default App;
