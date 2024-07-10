import { ProductRowProps } from "../interfaces/productRow";
import "../styles/productRow.css";

export default function ProductRow({
	product,
	checked,
	onCheck,
}: ProductRowProps) {
	return (
		<div className="product">
			<input
				type="checkbox"
				id={product.title}
				className="check"
				onChange={() => onCheck(product.id)}
				checked={checked}
			/>
			<label htmlFor={product.title} className="checkbox">
				<div className="mark"></div>
			</label>
			<label htmlFor={product.title}>{product.title}</label>
		</div>
	);
}
