import Models from "../Models";

const increaseStock = async (itemId, quantity) => {
    let { stock } = await Models.Item.findOne({ _id: itemId });
    let newStock = parseInt(stock) + parseInt(quantity);

    const reg = await Models.Item.findByIdAndUpdate({ _id: itemId }, { stock: newStock })
}

const decreaseStock = async (itemId, quantity) => {
    let { stock } = await Models.Item.findOne({ _id: itemId });
    let newStock = parseInt(stock) - parseInt(quantity); // TODO -> Revisar, aca puede que quede stock negativo

    const reg = await Models.Item.findByIdAndUpdate({ _id: itemId }, { stock: newStock })
}

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.Sell.create(req.body);

            //Luego de realizar una venta, actualizo el stock
            let details = req.body.details;
            details.map((x) => {
                decreaseStock(x._id, x.quantity);
            });

            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await Models.Sell.findOne({ _id: req.query._id })
                .populate('user', { name: 1 })
                .populate('person', { name: 1 });
            if (!reg) {
                res.status(404).send({
                    message: 'Not found'
                })
            } else {
                res.status(200).json(reg);
            }
        } catch (e) {
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await Models.Sell.find({ $or: [{ 'receiptNumber': new RegExp(value, 'i') }, { 'receiptSeries': new RegExp(value, 'i') }] }) //Buscar por numero de recibo o numero de serie ignorando mayusculas y minusculas
                .populate('user', { name: 1 })
                .populate('person', { name: 1 })
                .sort({ 'createdAt': -1 }); //Ordenado por fecha de creacion desc
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.Sell.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });

            //Luego de activar una venta, actualizo el stock
            let details = reg.details;
            details.map((x) => {
                decreaseStock(x._id, x.quantity);
            });

            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.Sell.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });

            //Luego de desactivar una venta, actualizo el stock
            let details = reg.details;
            details.map((x) => {
                increaseStock(x._id, x.quantity);
            });

            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    }
}