import Models from "../Models";

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.Category.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await Models.Category.findOne({ _id: req.query._id });
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
            const reg = await Models.Category.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'description': new RegExp(value, 'i') }] }, { createdAt: 0 }) //Buscar por nombre y descripcion ignorando mayusculas o minusculas, no mostrar createdAt
                .sort({ 'createdAt': -1 }) //Ordenado por fecha de creacion desc
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const reg = await Models.Category.findByIdAndUpdate({ _id: req.body._id }, { name: req.body.name, description: req.body.description });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await Models.Category.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.Category.findByIdAndUpdate({ _id: req.body._id }, { isActive: true });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.Category.findByIdAndUpdate({ _id: req.body._id }, { isActive: false });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    }
}