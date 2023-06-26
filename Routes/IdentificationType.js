import routerx from "express-promise-router";
import IdentificationTypeController from "../Controllers/IdentificationTypeController";
import Auth from "../Middlewares/Auth"

const router = routerx();
const controller = IdentificationTypeController;

router.post('/add', Auth.isAdmin, controller.add);
router.get('/query', Auth.isAdmin, controller.query);
router.get('/list', Auth.isAdmin, controller.list);
router.put('/update', Auth.isAdmin, controller.update);
router.delete('/remove', Auth.isAdmin, controller.remove);
router.put('/activate', Auth.isAdmin, controller.activate);
router.put('/deactivate', Auth.isAdmin, controller.deactivate);

export default router;