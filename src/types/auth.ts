export type RegisterData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

export type LoginResponse = {
    access_token: string;
    token_type: string;
};