import client from "./sqlite-client";

interface Auth {
    id: string;
    password: string;
}

export function getAdmin() {
    return new Promise<Auth>((res, rej) => {
        client.get(`SELECT ID as id, PASSWORD as password FROM ADMIN`, (err, row: Auth) => {
            if (err) rej(err);
            const { id, password } = row;
            res({ id, password });
        })
    });
}