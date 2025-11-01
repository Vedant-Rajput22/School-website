const TOKEN_KEY = 'bs_token'

export function saveToken(token: string){
  localStorage.setItem(TOKEN_KEY, token)
}
export function getToken(){
  return localStorage.getItem(TOKEN_KEY)
}
export function isLoggedIn(){
  return !!getToken()
}
export function logout(){
  localStorage.removeItem(TOKEN_KEY)
}

