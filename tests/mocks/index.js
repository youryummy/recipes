const CircuitBreaker = require("../../circuitBreaker/circuitBreaker.js");
const {stub} = require("sinon");

export default {
    circuitBreaker,
}

function circuitBreaker(throwException = false, reason) {
    return {
        fire : (fireFuncName, result) => stub(CircuitBreaker, "getBreaker").returns({
            fire: (fname, ...args) => throwException ? Promise.reject(reason) : Promise.resolve(result)
        })
    }
}

module.exports = {
    "circuitBreaker": circuitBreaker
}
