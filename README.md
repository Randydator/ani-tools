Various (hopefully) helpful Anilist tools :)

Feel free to suggest tool ideas in github issues!

## Use locally: 
```
npm i
npm run dev
```
The Login won't work locally because the redirect url is set to the production url. 
To login locally, simulate a login by going providing the oauthCallback a token. 
e.g.
```
http://localhost:5173/oauthCallback#access_token=*valid access token here*
```
You can get a valid token from the cookie of the production site or by any other way Anilist oauth offers tokens. 

