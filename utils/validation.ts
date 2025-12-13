export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateStrongPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(password);
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0;
};

export const validateCode = (code: string[], length: number = 6): boolean => {
    return code.join("").length === length;
};

export const getPasswordErrorMessage = (): string => {
    return "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.";
};