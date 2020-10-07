const response = {
    success: (res, data, message) => {
        const result = {
            code: 200,
            status: true,
            message: message,
            data: data
        }
        res.json(result)
    },
    failed: (res, data, message) => {
        const result = {
            code: 500,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    failedReg: (res, data, message) => {
        const result = {
            code: 402,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    failedLog: (res, data, message) => {
        const result = {
            code: 401,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    loginSuccess: (res, id, username, token, refreshToken, message) => {
        const result = {
            code: 200,
            status: true,
            message: message,
            data: {
                id,
                username,
                token,
                refreshToken
            }
        }
        res.json(result)
    },
    successWithMeta: (res, data, meta, message) => {
        const result = {
            message,
            success: true,
            code: 200,
            meta,
            data,
        };
        res.status(200)
        res.json(result);
    },
    tokenExpired: (res, data, message) => {
        const result = {
            code: 403,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    tokenError: (res, data, message) => {
        const result = {
            code: 405,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    admErrToken: (res, data, message) => {
        const result = {
            code: 406,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    }
}

module.exports = response