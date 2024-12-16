import Models from "../Models";

export default {
    add: async (req, res, next) => {
        try {
            const reg = await Models.Person.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            const reg = await Models.Person.findOne({ _id: req.query._id })
                .populate('person_type', { personTypeDescription: 1 })
                .populate('id_type', { identificationTypeDescription: 1 });
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
            const reg = await Models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }] }, { createdAt: 0 }) //Buscar por nombre o email ignorando mayusculas o minusculas, no mostrar createdAt
                .populate('person_type', { personTypeDescription: 1 }) //Aca se hace referencia al campo, no al documento personType
                .populate('id_type', { identificationTypeDescription: 1 })
                .sort({ 'createdAt': -1 }); //Ordenado por fecha de creacion desc
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    listClients: async (req, res, next) => {
        try {
            let value = req.query.value;
            let reg = await Models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }] }, { createdAt: 0 }) //Buscar por nombre o email ignorando mayusculas o minusculas, no mostrar createdAt
                .populate('person_type', { personTypeDescription: 1 })
                .populate('id_type', { identificationTypeDescription: 1 })
                .sort({ 'createdAt': -1 }); //Ordenado por fecha de creacion desc

            reg = reg.filter(x => x.person_type.personTypeDescription === "Client"); //No puedo filtrar en el find porque en ese punto person_type todavia no existe

            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    listSuppliers: async (req, res, next) => {
        try {
            let value = req.query.value;
            let reg = await Models.Person.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }] }, { createdAt: 0 }) //Buscar por nombre o email ignorando mayusculas o minusculas, no mostrar createdAt
                .populate('person_type', { personTypeDescription: 1 })
                .populate('id_type', { identificationTypeDescription: 1 })
                .sort({ 'createdAt': -1 }); //Ordenado por fecha de creacion desc

            reg = reg.filter(x => x.person_type.personTypeDescription === "Supplier"); //No puedo filtrar en el find porque en ese punto person_type todavia no existe

            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            const reg = await Models.Person.findByIdAndUpdate({ _id: req.body._id }, { person_type: req.body.person_type, name: req.body.name, id_type: req.body.id_type, id_number: req.body.id_number, address: req.body.address, phone: req.body.phone, email: req.body.email });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await Models.Person.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.Person.findByIdAndUpdate({ _id: req.body._id }, { status: 1 });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.Person.findByIdAndUpdate({ _id: req.body._id }, { status: 0 });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    }
}