IF Error: listen EADDRINUSE: address already in use :::5000
run cmd.exe as administrator and run command:
taskkill /F /IM node.exe

To update schema in database:
terminal> npx prisma migrate dev --name <migration-name>

To update Prisma.Client:
terminal> npx prisma generate
