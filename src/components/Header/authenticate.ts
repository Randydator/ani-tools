/* I researched security a ton and this is what I got: 

    Cookies can be made secure enough with the secure flag and the same-site flag.
    This prevents against man in the middle interceptions and cross-site scripting attacks.
    It is only vulnerable to CSRF attacks. 
    To counteract this, I need to be very careful to sanatize all user input and output. 
    This should make browser cookies safe enough to use.

    If I need more, I could use my set up cloudflare d1 and implment some sort of session management system
    with encryption that can also shorten the tokens. 
*/

export function login() {
    console.log("Started login")
    const client_id: number = 22594;
    const loginUrl: string = `https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token`;

    window.location.href = loginUrl; // Redirect to the AniList login page
}