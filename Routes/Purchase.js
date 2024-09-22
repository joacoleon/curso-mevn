import routerx from "express-promise-router";
import PurchaseController from "../Controllers/PurchaseController";
import Auth from "../Middlewares/Auth"

const router = routerx();
const controller = PurchaseController;

router.post('/add', Auth.isStorage, controller.add);
router.get('/query', Auth.isStorage, controller.query);
router.get('/list', Auth.isStorage, controller.list);
router.put('/activate', Auth.isStorage, controller.activate);
router.put('/deactivate', Auth.isStorage, controller.deactivate);

export default router;