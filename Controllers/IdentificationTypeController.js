import Models from "../Models";

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.IdentificationType.create(req.body);
            res.status(200).json(reg);
        } catch(e) {
            res.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await Models.IdentificationType.findOne({_id: req.query._id});
            if(!reg){
                res.status(404).send({
                    message: 'Not found'
                })
            } else {
                res.status(200).json(reg);
            }
        } catch(e) {
            req.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    },

    list: async (req, res, next) => { //Ver como buscar por 2 valores cuando uno es int y el otro string
        try {
            let value = req.query.value;
            const reg = await Models.IdentificationType.find({$or:[{'identificationTypeDescription': new RegExp(value, 'i')},{'identificationTypeCode': value}]}, {createdAt: 0}) //Buscar por id o descripcion ignorando mayusculas o minusculas, no mostrar createdAt
            .sort({'createdAt': -1}) //Ordenado por fecha de creacion desc
            res.status(200).json({result: 'OK', data: reg})
        } catch(e) {
            console.log(e);
            req.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const reg = await Models.IdentificationType.findByIdAndUpdate({_id: req.body._id}, {identificationTypeCode: req.body.identificationTypeCode, identificationTypeDescription: req.body.identificationTypeDescription});
            res.status(200).json(reg);
        } catch(e) {
            req.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await Models.IdentificationType.findByIdAndDelete({_id: req.body._id});
            res.status(200).json(reg);
        } catch(e) {
            req.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.IdentificationType.findByIdAndUpdate({_id: req.body._id}, {status: 1});
            res.status(200).json(reg);
        } catch(e) {
            req.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.IdentificationType.findByIdAndUpdate({_id: req.body._id}, {status: 0});
            res.status(200).json(reg);
        } catch(e) {
            req.status(500).send({
                message: 'An error occurred'
            });
            next(e);
        }
    }
}