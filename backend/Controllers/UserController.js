import Models from "../Models";
import bcrypt from 'bcryptjs';
import TokenService from '../Services/TokenService';

export default {
    login: async (req, res, next) => {
        try {
            let userForLogin = await Models.User.findOne({ email: req.body.email, status: 1 })
                .populate('role'); //Busco el usuario por id, validando que este activo

            if (userForLogin) {
                let passwordsMatch = await bcrypt.compare(req.body.password, userForLogin.password);
                if (passwordsMatch) {
                    let userToken = await TokenService.encode(userForLogin._id, userForLogin.email, userForLogin.role);
                    res.status(200).json({ userForLogin, userToken });
                } else {
                    res.status(404).send({
                        message: 'Incorrect user or password.' //Aca es incorrect password pero es mas seguro no especificar
                    })
                }
            } else {
                res.status(404).send({
                    message: 'Incorrect user or password.' //Aca es incorrect user pero es mas seguro no especificar
                });
            }
        } catch (e) {
            next(e);
        }
    },

    add: async (req, res, next) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10); //Encripto la contraseña
            const reg = await Models.User.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    query: async (req, res, next) => {
        try {
            if (req.query._id.match(/^[0-9a-fA-F]{24}$/)) { //Pregunto si es un id valido para evitar error
                const reg = await Models.User.findOne({ _id: req.query._id })
                    .populate('role')
                    .populate('id_type', { identificationTypeDescription: 1 });
                if (!reg) {
                    res.status(200).send({
                        success: false,
                        code: 204,
                        message: 'User not found'
                    })
                } else {
                    res.status(200).json(reg);
                }
            } else {
                res.status(404).send({
                    success: false,
                    code: 404,
                    message: 'Invalid user id'
                })
            }
        } catch (e) {
            next(e);
        }
    },

    list: async (req, res, next) => {
        try {
            let value = req.query.value;
            const reg = await Models.User.find({ $or: [{ 'name': new RegExp(value, 'i') }, { 'role.userTypeDescription': new RegExp(value, 'i') }, { 'email': new RegExp(value, 'i') }] }, { createdAt: 0 }) //Buscar por nombre, rol id e email ignorando mayusculas o minusculas, no mostrar createdAt
                .populate('role')
                .populate('id_type', { identificationTypeDescription: 1 })
                .sort({ 'createdAt': -1 }); //Ordenado por fecha de creacion desc
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    update: async (req, res, next) => {
        try {
            let newPassword = req.body.password;
            let userToUpdate = await Models.User.findOne({ _id: req.body._id });

            if (newPassword != userToUpdate.password) //Si la contraseña nueva es diferente a la contraseña del usuario
                req.body.password = await bcrypt.hash(req.body.password, 10); //Encripto la contraseña

            const reg = await Models.User.findByIdAndUpdate({ _id: req.body._id }, { role: req.body.role, name: req.body.name, id_type: req.body.id_type, id_number: req.body.id_number, address: req.body.address, phone: req.body.phone, email: req.body.email, password: req.body.password });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    remove: async (req, res, next) => {
        try {
            const reg = await Models.User.findByIdAndDelete({ _id: req.body._id });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    activate: async (req, res, next) => {
        try {
            const reg = await Models.User.findByIdAndUpdate({ _id: req.body._id }, { isActive: true });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    },

    deactivate: async (req, res, next) => {
        try {
            const reg = await Models.User.findByIdAndUpdate({ _id: req.body._id }, { isActive: false });
            res.status(200).json(reg);
        } catch (e) {
            next(e);
        }
    }
}