import { useState, useEffect } from "react";
import { FetchProps } from "../interfaces/useFetch";

export const useFetch = <T>(url: string | null): FetchProps<T> => {
	const [data, setData] = useState<T | null>(null);
	const [isPending, setIsPending] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!url) return;
		const fetchData = async () => {
			setIsPending(true);
			try {
				const controller = new AbortController();
				const response = await fetch(url);
				if (!response.ok) throw new Error(response.statusText);
				const json = await response.json();
				setIsPending(false);
				setData(json);
				setError(null);
				return () => controller.abort();
			} catch (error) {
				setError(`${error} Could not fetch data`);
				setIsPending(false);
			}
		};

		fetchData();
	}, [url]);
	if (!url) return { data: null, isPending: false, error: null };
	return { data, isPending, error };
};
