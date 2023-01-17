import { CircuitBreaker } from "../../circuitBreaker/circuitBreaker.js";
import { stub } from 'sinon';
import axios from 'axios';

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