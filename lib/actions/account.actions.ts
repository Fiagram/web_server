import { parseStringify } from "../utils";

export const logoutAccount = async () => {
    try {
        localStorage.removeItem('token')
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getLoggedInAccount = async () => {
    try {
        const account: Account = {
            username: "tamnnm",
            fullname: "Nguyễn Ngọc Minh Tâm",
            email: "adsfadf@gmail.com",
            phoneNumber: {
                countryCode: "+84",
                number: "123456789",
            },
            role: "member",
        };
        return parseStringify(account);
    } catch (error) {
        console.log(error);
        return null;
    }
}