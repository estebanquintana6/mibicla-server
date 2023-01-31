import bcrypt from "bcryptjs";

export const hashPassword = async (plainPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(plainPassword, salt)
    return password;
}

export const verifyPassword = async (plainPassword: string, password: string) => {
    const isValid = await bcrypt.compare(plainPassword, password);
    return isValid;
}