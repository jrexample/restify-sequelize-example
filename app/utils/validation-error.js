'use strict';

class ValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.name = 'Validation Error';
        this.errors = errors;
    }
}

module.exports = ValidationError;
