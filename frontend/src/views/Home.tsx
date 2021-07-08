import React from "react";
import { useSnackBar } from "../util/SnackBarContext";

export const Home: React.FC = () => {
	const {state, dispatch} = useSnackBar();

	const handleClick = () => {
		dispatch({type: 'error', error: "SOmething went wrong"})
	}
	


	return (
		<div>
			{state.description}
			<div>
				<button onClick={handleClick}>Click</button>
			</div>
		</div>
	)
}