import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {connectDB} from '../config/db.js';
import {User} from '../models/User.js';
await connectDB();
const email=process.env.ADMIN_EMAIL||'admin@helpdesk.local';
const password=process.env.ADMIN_PASSWORD||'Admin@12345';
const existing=await User.findOne({email});
if(existing){existing.role='admin';await existing.save();console.log('Existing account promoted to admin:',email);}
else {await User.create({name:process.env.ADMIN_NAME||'HelpDesk Admin',email,passwordHash:await bcrypt.hash(password,12),role:'admin'});console.log('Admin created:',email);}
process.exit(0);
