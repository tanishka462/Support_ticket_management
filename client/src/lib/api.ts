const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export function getToken(){return localStorage.getItem('helpdesk_token');}
export async function api<T=any>(path:string,options:RequestInit={}):Promise<T>{
 const token=getToken();const res=await fetch(`${API}${path}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...(options.headers||{})}});
 const body=await res.json().catch(()=>({message:'Unexpected server response'}));
 if(!res.ok)throw new Error(body.message||'Request failed');return body;
}
