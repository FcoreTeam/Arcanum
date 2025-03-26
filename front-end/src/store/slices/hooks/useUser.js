import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../userSlice";

export const useUser = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()

    return {
        ...user,
        setUser: (user) => dispatch(setUser(user))
    }
}