export const getToken = (): string => {
    return localStorage.getItem("TOKEN") ?? "";
};

export const refreshToken = (): string => {
    return localStorage.getItem("REFRESH_TOKEN") ?? "";
};