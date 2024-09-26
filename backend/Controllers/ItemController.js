import Models from "../Models";
//import errorHandler from "../Middlewares/ErrorHandling";

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.Item.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            //errorHandler(e, req, res);
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await Models.Item.findOne({ _id: req.query._id })
                .populate('category', { name: 1 }); //Hago referencia a categoria y muestro solo el nombre;
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

    queryByCode: async (req, res, next) => {
        try {
            const reg = await Models.Item.findOne({ code: req.query.code })
                .populate('category', { name: 1 }); //Hago referencia a categoria y muestro solo el nombre;
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
            const reg = await Models.Item.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'description': new RegExp(value, 'i') }] }, { createdAt: 0 }) //Buscar por nombre y descripcion ignorando mayusculas o minusculas, no mostrar createdAt
                .populate('category', { name: 1 }) //Hago referencia a categoria y muestro solo el nombre
                .sort({ 'createdAt': -1 }); //Ordenado por fecha de creacion desc
            res.status(200).json({ result: 'OK', data: reg });
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const reg = await Models.Item.findByIdAndUpdate({ _id: req.body._id }, { category: req.body.category, code: req.body.code, name: req.body.name, description: req.body.description, price: req.body.price, stock: req.body.stock });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await Models.Item.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.Item.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.Item.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    }
}