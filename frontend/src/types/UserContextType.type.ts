import { Dispatch, SetStateAction } from "react";
import { UserResultType } from "./UserResultType.type";

export type UserContextType = {
	user: UserResultType | undefined | null,
	setUser:  Dispatch<SetStateAction<UserResultType | undefined>> | undefined,
}