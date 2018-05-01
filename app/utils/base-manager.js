'use strict';

class BaseManager {
    constructor(model) {
        this.model = model;
    }

    validate(data) {
        return Promise.reject("validate(data) not implemented");
    }

    beforeInsert(data) {
        return Promise.resolve(data);
    }

    afterInsert(data) {
        return Promise.resolve(data.id);
    }

    beforeUpdate(data) {
        return Promise.resolve(data);
    }

    afterUpdate(data) {
        return Promise.resolve(data.id);
    }

    get() {
        return new Promise((resolve, reject) => {
            this.model.findAll()
                .then(result => {
                    resolve(result);
                });
        });
    }

    getById(id) {
        return this.model.findById(id);
    }

    create(data) {
        return this.validate(data)
            .then(validData => this.beforeInsert(validData))
            .then(processedData => this.model.create(processedData))
            .then(createdData => this.afterInsert(createdData));
    }

    update(data) {
        return this.validate(data)
            .then(validData => this.beforeUpdate(validData))
            .then(processedData => this.model.update(data, { where: { id: data.id } }))
            .then(updatedData => this.afterUpdate(updatedData));
    }

    delete(id) {
        return this.model.destroy({ where: { id: id } });
    }

    exists(id) {
        return new Promise((resolve, reject) => {
            this.model.findById(id)
                .then(result => {
                    if (result)
                        resolve(true);
                    else
                        resolve(false);
                });
        });
    }
}

module.exports = BaseManager;