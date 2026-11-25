import {createContext,useContext,useEffect,useState,ReactNode} from 'react';import {api,getToken} from '../lib/api';
type User={id:string;name:string;email:string;role:'user'|'admin'};
type AuthValue={user:User|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;register:(name:string,email:string,password:string)=>Promise<void>;logout:()=>void};
const C=createContext<AuthValue>(null!);
export const useAuth=()=>useContext(C);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{if(getToken())api('/auth/me').then(r=>setUser(r.data.user)).catch(()=>localStorage.removeItem('helpdesk_token')).finally(()=>setLoading(false));else setLoading(false)},[]);
 async function auth(path:string,data:any){const r=await api(path,{method:'POST',body:JSON.stringify(data)});localStorage.setItem('helpdesk_token',r.data.token);setUser(r.data.user);}
 function logout(){localStorage.removeItem('helpdesk_token');setUser(null);}
 return <C.Provider value={{user,loading,login:(email,password)=>auth('/auth/login',{email,password}),register:(name,email,password)=>auth('/auth/register',{name,email,password}),logout}}>{children}</C.Provider>
}
