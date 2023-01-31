"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = void 0;
const Role_1 = __importDefault(require("../models/Role"));
const createRole = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return Role_1.default.findOne({ name }).then((exist) => __awaiter(void 0, void 0, void 0, function* () {
        if (exist)
            return exist;
        const role = new Role_1.default({ name });
        const roleResponse = yield role.save();
        if (roleResponse.id != null)
            console.log("ROLE CREATED:", roleResponse.get('name'));
        return roleResponse;
    }));
});
const initializeDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield createRole('SUPERADMIN');
    yield createRole('ADMIN');
    yield createRole('USUARIO');
    console.log("hello");
});
exports.initializeDb = initializeDb;
