import routerx from "express-promise-router";
import PersonController from "../Controllers/PersonController";
import Auth from "../Middlewares/Auth"

const router = routerx();
const controller = PersonController;

router.post('/add', Auth.isUser, controller.add);
router.get('/query', Auth.isUser, controller.query);
router.get('/list', Auth.isUser, controller.list);
router.get('/listClients', Auth.isUser, controller.listClients);
router.get('/listSuppliers', Auth.isUser, controller.listSuppliers);
router.put('/update', Auth.isUser, controller.update);
router.delete('/remove', Auth.isUser, controller.remove);
router.put('/activate', Auth.isUser, controller.activate);
router.put('/deactivate', Auth.isUser, controller.deactivate);

export default router;