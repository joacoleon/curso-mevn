import jwt from 'jsonwebtoken';
import Models from '../Models';

const clientSecret = "chapuCataNegrita";

async function checkToken(token) { //Repasar esto
    let __id = null;
    try {
        const { _id } = await jwt.decode(token); //Obtengo el id de usuario del token
        __id = _id;

        const user = await Models.User.findOne({ _id: __id, status: 1 })
            .populate('role'); //Busco el usuario por id, validando que este activo

        if (user) { //Si lo obtengo
            const token = jwt.sign({ _id: __id }, clientSecret, { expiresIn: '1d' }); //Renuevo el token
            return { token, role: user.role.userTypeCode }; //Devuelvo el token y rol
        } else {
            return false;
        }

    } catch (e) {
        return false;
    }
}

export default {
    encode: async (_id) => {
        const token = jwt.sign({ _id: _id }, clientSecret, { expiresIn: '1d' });
        return token;
    },

    async decode(token) {
        try {
            const { _id } = await jwt.verify(token, clientSecret); //Para obtener solo el id, si no tendria que guardar el objeto completo y en otra propiedad el id (comentado abajo)
            const user = await Models.User.findOne({ _id, status: 1 })
                .populate('role'); //Si tiene el mismo nombre no hace falta _id: _id?

            //const decoded = await jwt.verify(token, clientSecret);
            //const decodedId = decoded._id;
            //const user = await Models.User.findOne({ decodedId, status: 1 });

            if (user) {
                return { role: user.role.userTypeCode };
            } else {
                return false;
            }
        } catch (e) {
            const newToken = await checkToken(token);
            return newToken;
        }
    }
}