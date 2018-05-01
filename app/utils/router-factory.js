'use strict';

const DbConfig = require('../db');
const Router = require("restify-router").Router;
const Sequelize = require('sequelize');

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    ERROR: 500,
};

function getRouterFactory(Manager) {
    let router = new Router();

    function getSequelize() {
        const sequelize = new Sequelize(DbConfig.database, DbConfig.username, DbConfig.password, {
            host: DbConfig.host,
            dialect: DbConfig.dialect,
            operatorsAliases: DbConfig.operatorsAliases,
        });

        return Promise.resolve(sequelize);
    }

    function getManager(sequelize) {
        let db = {
            sequelize: sequelize,
            DataTypes: Sequelize.DataTypes,
        };

        return Promise.resolve(new Manager(db));
    }

    router.get('/', (req, res, next) => {
        let db;

        getSequelize()
            .then((sequelize) => {
                db = sequelize;

                return getManager(db)
                    .then(manager => {
                        return Promise.resolve(manager);
                    });
            })
            .then(manager => {
                return manager.get();
            })
            .then(result => {
                db.close();
                res.send(STATUS_CODE.OK, result);
            })
            .catch(error => {
                db.close();
                res.send(STATUS_CODE.ERROR, error);
            });
    });

    router.get('/:id', (req, res, next) => {
        let db;
        let id = req.params.id;

        getSequelize()
            .then((sequelize) => {
                db = sequelize;

                return getManager(db)
                    .then(manager => {
                        return Promise.resolve(manager);
                    });
            })
            .then(manager => {
                return manager.getById(id);
            })
            .then(result => {
                db.close();

                if (result)
                    res.send(STATUS_CODE.OK, result);
                else
                    res.send(STATUS_CODE.NOT_FOUND);
            })
            .catch(error => {
                db.close();
                res.send(STATUS_CODE.ERROR, error);
            });
    });

    router.post('/', (req, res, next) => {
        let db;
        let data = req.body;

        getSequelize()
            .then((sequelize) => {
                db = sequelize;

                return getManager(db)
                    .then(manager => {
                        return Promise.resolve(manager);
                    });
            })
            .then(manager => {
                return manager.create(data);
            })
            .then(result => {
                db.close();
                res.header("Location", `${req.url}/${result.toString()}`);
                res.send(STATUS_CODE.CREATED);
            })
            .catch(error => {
                db.close();

                let statusCode = STATUS_CODE.ERROR;

                if (error.name === 'Validation Error')
                    statusCode = STATUS_CODE.BAD_REQUEST;

                res.send(statusCode, error.errors);
            });
    });

    router.put('/:id', (req, res, next) => {
        let db;
        let id = req.params.id;
        let data = req.body;

        if (id != data.id) {
            res.send(STATUS_CODE.BAD_REQUEST);
        }
        else {
            getSequelize()
                .then((sequelize) => {
                    db = sequelize;

                    return getManager(db)
                        .then(manager => {
                            return Promise.resolve(manager);
                        });
                })
                .then(manager => {
                    return manager.exists(id)
                        .then(exists => {
                            let result;

                            if (exists) {
                                return manager.update(data)
                                    .then(() => {
                                        result = STATUS_CODE.NO_CONTENT;
                                        return Promise.resolve(result);
                                    });
                            }
                            else {
                                result = STATUS_CODE.NOT_FOUND;
                                return Promise.resolve(result);
                            }
                        });
                })
                .then(result => {
                    db.close();
                    res.send(result);
                })
                .catch(error => {
                    db.close();

                    let statusCode = STATUS_CODE.ERROR;

                    if (error.name === 'Validation Error')
                        statusCode = STATUS_CODE.BAD_REQUEST;

                    res.send(statusCode, error.errors);
                });
        }
    });

    router.del('/:id', (req, res, next) => {
        let db;
        let id = req.params.id;

        getSequelize()
            .then((sequelize) => {
                db = sequelize;

                return getManager(db)
                    .then(manager => {
                        return Promise.resolve(manager);
                    });
            })
            .then(manager => {
                return manager.exists(id)
                    .then(exists => {
                        let result;

                        if (exists) {
                            return manager.delete(id)
                                .then(() => {
                                    result = STATUS_CODE.NO_CONTENT;
                                    return Promise.resolve(result);
                                });
                        }
                        else {
                            result = STATUS_CODE.NOT_FOUND;
                            return Promise.resolve(result);
                        }
                    });
            })
            .then(result => {
                db.close();
                res.send(result);
            })
            .catch(error => {
                db.close();
                res.send(STATUS_CODE.ERROR, error);
            });
    });

    return router;
}

module.exports = getRouterFactory;
