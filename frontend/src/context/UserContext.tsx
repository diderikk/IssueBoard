import { createContext } from "react";
import { UserContextType } from "../types/UserContextType.type";



export const UserContext = createContext<UserContextType>({
	user: undefined,
	setUser: undefined
});