import routerx from "express-promise-router";
import SellController from "../Controllers/SellController";
import Auth from "../Middlewares/Auth";

const router = routerx();
const controller = SellController;

router.post('/add', Auth.isSales, controller.add);
router.get('/query', Auth.isSales, controller.query);
router.get('/list', Auth.isSales, controller.list);
router.put('/activate', Auth.isSales, controller.activate);
router.put('/deactivate', Auth.isSales, controller.deactivate);

export default router;