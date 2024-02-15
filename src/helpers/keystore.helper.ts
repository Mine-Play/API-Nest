import * as fs from 'fs';


export const JwtAccess = {
    public: fs.readFileSync('keystore/jwt_access/public.key', "ascii"),
    private: fs.readFileSync('keystore/jwt_access/private.key', "ascii")
}