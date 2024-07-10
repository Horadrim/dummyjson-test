import { useDebouncedCallback } from "use-debounce";
import { SearchBoxProps } from "../interfaces/searchbox";
import "../styles/searchBox.css";

export default function SearchBox({
	baseUrl,
	fetchLimit,
	changeUrl,
}: SearchBoxProps) {
	const delay = 500;

	const handleChange = useDebouncedCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const searchString = event.target.value;
			if (searchString !== "") {
				const newUrl = new URL(baseUrl);
				const newParams = new URLSearchParams();
				newParams.append("q", searchString);
				newParams.append("limit", fetchLimit.toString());
				newUrl.search = newParams.toString();

				changeUrl(newUrl.toString());
			} else {
				changeUrl(null);
			}
		},
		delay
	);

	return (
		<input
			className="search-box"
			type="text"
			onChange={(e) => handleChange(e)}
			placeholder="Keyword search..."
		/>
	);
}
