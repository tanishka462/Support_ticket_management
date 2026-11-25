# Local run checklist
1. Install MongoDB and make sure it is running.
2. Terminal 1: `cd server && cp .env.example .env && npm install && npm run seed:admin && npm run dev`
3. Terminal 2: `cd client && cp .env.example .env && npm install && npm run dev`
4. Visit http://localhost:5173
