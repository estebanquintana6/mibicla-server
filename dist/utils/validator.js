"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.validateName = exports.validateEmail = exports.validatePassword = void 0;
const validatePassword = (password) => {
    if (password.length < 8) {
        return false;
    }
    return true;
};
exports.validatePassword = validatePassword;
const validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true);
    }
    return (false);
};
exports.validateEmail = validateEmail;
const validateName = (name) => {
    return (name || name.length !== 0);
};
exports.validateName = validateName;
const isAdmin = (user) => {
    if (!user) {
        return false;
    }
    return (user.role === "ADMIN" || user.role === "SUPER_ADMIN");
};
exports.isAdmin = isAdmin;
