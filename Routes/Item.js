import routerx from "express-promise-router";
import ItemController from "../Controllers/ItemController";
import Auth from "../Middlewares/Auth";

const router = routerx();
const controller = ItemController;

router.post('/add', Auth.isStorage, controller.add);
router.get('/query', Auth.isStorage, controller.query);
router.get('/list', Auth.isStorage, controller.list);
router.put('/update', Auth.isStorage, controller.update);
router.delete('/remove', Auth.isStorage, controller.remove);
router.put('/activate', Auth.isStorage, controller.activate);
router.put('/deactivate', Auth.isStorage, controller.deactivate);

export default router;