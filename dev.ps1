# Start all development servers

# Terminal 1: Start backend (use correct script name)
Start-Process powershell -ArgumentList "cd backend; npm run dev"

# Terminal 2: Start client frontend
Start-Process powershell -ArgumentList "cd frontend; npm run dev"

# Terminal 3: Start admin frontend
Start-Process powershell -ArgumentList "cd admin-frontend; npm run dev"