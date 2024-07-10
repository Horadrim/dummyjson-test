export interface SearchBoxProps {
	baseUrl: string;
	fetchLimit: number;
	changeUrl: React.Dispatch<React.SetStateAction<string | null>>;
}
