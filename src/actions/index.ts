import authActions from "@/actions/auth.actions";
import meActions from "@/actions/me.actions";
import os from "@/actions/os";
import { authMiddleware } from "@/middlewares/auth";

const router = os.use(authMiddleware).router({
	auth: authActions,
	me: meActions,
});

export default router;
