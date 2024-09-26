import TokenService from "../Services/TokenService";

export default {
    isUser: async (req, res, next) => { //Para que tener este metodo si los otros hacen lo mismo? Este metodo abarca los 3 roles
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Token missing'
            });
        } else {
            const response = await TokenService.decode(req.headers.token);

            if (response.role) {
                next();
            } else {
                return res.status(403).send({
                    message: 'Unauthorized'
                });
            }
        }
    },

    isAdmin: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Token missing'
            });
        } else {
            const response = await TokenService.decode(req.headers.token);

            if (response.role == "1") {
                next();
            } else {
                return res.status(403).send({
                    message: 'Unauthorized'
                });
            }
        }
    },

    isStorage: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Token missing'
            });
        } else {
            const response = await TokenService.decode(req.headers.token);

            if (response.role == "1" || response.role == "3") {
                next();
            } else {
                return res.status(403).send({
                    message: 'Unauthorized'
                });
            }
        }
    },

    isSales: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'Token missing'
            });
        } else {
            const response = await TokenService.decode(req.headers.token);

            if (response.role == "1" || response.role == "2") {
                next();
            } else {
                return res.status(403).send({
                    message: 'Unauthorized'
                });
            }
        }
    }
}