import Models from "../Models";

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.UserType.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await Models.UserType.findOne({ _id: req.query._id });
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

    list: async (req, res, next) => { //Ver como buscar por 2 valores cuando uno es int y el otro string
        try {
            let value = req.query.value;
            const reg = await Models.UserType.find({ $or: [{ 'userTypeDescription': new RegExp(value, 'i') }, { 'userTypeCode': value }] }, { createdAt: 0 }) //Buscar por id o descripcion ignorando mayusculas o minusculas, no mostrar createdAt
                .sort({ 'createdAt': -1 }) //Ordenado por fecha de creacion desc
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const reg = await Models.UserType.findByIdAndUpdate({ _id: req.body._id }, { userTypeCode: req.body.userTypeCode, userTypeDescription: req.body.userTypeDescription });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await Models.UserType.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.UserType.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.UserType.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    }
}