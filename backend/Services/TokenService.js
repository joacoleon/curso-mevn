import jwt from 'jsonwebtoken';
import Models from '../Models';

const clientSecret = "chapuCataNegrita";

async function checkToken(token) { //Repasar esto
    let __id = null;
    try {
        const { _id } = await jwt.decode(token); //Obtengo el id de usuario del token
        __id = _id;

        const user = await Models.User.findOne({ _id: __id, isActive: true })
            .populate('role'); //Busco el usuario por id, validando que este activo

        if (user) { //Si lo obtengo
            const token = jwt.sign({ _id: __id }, clientSecret, { expiresIn: '24h' }); //Renuevo el token
            return { token, role: user.role.userTypeCode }; //Devuelvo el token y rol
        } else {
            return false;
        }

    } catch (e) {
        return false;
    }
}

export default {
    encode: async (_id, email, role) => {
        const token = jwt.sign({ _id: _id, email: email, role: role }, clientSecret, { expiresIn: '24h' });
        return token;
    },

    decode: async (token) => {
        try {
            const { _id } = await jwt.verify(token, clientSecret); //Para obtener solo el id, si no tendria que guardar el objeto completo y en otra propiedad el id (comentado abajo)
            const user = await Models.User.findOne({ _id, isActive: true })
                .populate('role');

            //const decoded = await jwt.verify(token, clientSecret);
            //const decodedId = decoded._id;
            //const user = await Models.User.findOne({ decodedId, status: 1 });

            if (user) {
                return { role: user.role.userTypeCode };
            } else {
                return false;
            }
        } catch (e) {
            //El token expiro entonces entra en el catch, donde se renueva. Esta bien que se renueve?
            //const newToken = await checkToken(token);
            //return newToken;
            throw e;
        }
    }
}