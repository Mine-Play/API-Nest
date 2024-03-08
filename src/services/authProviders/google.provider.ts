import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleProvider
{
    private CLIENT = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET_KEY, process.env.GOOGLE_REDIRECT_URI);

    private scopes = [
        'openid',
        'profile',
        'email',
    ];


    getRedirectURL() {
        return this.CLIENT.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
            include_granted_scopes: true
          });
    }

    async callback(request) {
        let { tokens } = await this.CLIENT.getToken(request.code);
        this.CLIENT.setCredentials(tokens);
    }
}