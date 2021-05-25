'use strict';
//=============Model Route========================
const supplierModel=require('./supplierModel');
const bookingCarFlow=require('./bookingCartFlow');
const services=require('./services');
const users = require('./user');
const agents = require('./agent');
const supplier=require('./supplierModel')
const commision=require('./commision')
module.exports = {
    supplierModel:supplierModel,
    bookingCarFlow:bookingCarFlow,
    services:services,
    users:users,
    agents:agents,
    supplier:supplier,
    commision:commision
};
