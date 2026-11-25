import {registerSchema,ticketSchema} from '../validation/schemas.js';
describe('Request validation',()=>{
 it('rejects weak passwords',()=>expect(registerSchema.safeParse({name:'Test User',email:'test@example.com',password:'123'}).success).toBe(false));
 it('rejects short ticket descriptions',()=>expect(ticketSchema.safeParse({title:'Help me',description:'short'}).success).toBe(false));
});
