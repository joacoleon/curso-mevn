import routerx from "express-promise-router";
import CategoryRouter from "./Category";
import ItemRouter from "./Item";
import UserRouter from "./User";
import PersonRouter from "./Person";
import PersonTypeRouter from "./PersonType";
import UserTypeRouter from "./UserType";
import IdentificationTypeRouter from "./IdentificationType";
import PurchaseRouter from "./Purchase";
import SellRouter from "./Sell";

const router = routerx();

router.use('/category', CategoryRouter);
router.use('/item', ItemRouter);
router.use('/user', UserRouter);
router.use('/person', PersonRouter);
router.use('/personType', PersonTypeRouter);
router.use('/userType', UserTypeRouter);
router.use('/identificationType', IdentificationTypeRouter);
router.use('/purchase', PurchaseRouter);
router.use('/sell', SellRouter);

export default router;