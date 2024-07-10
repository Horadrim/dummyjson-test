export interface FetchProps<T> {
	data: T | null;
	isPending: boolean;
	error: string | null;
}
