## Remote Keyboard  

This repository contains both the **client** (frontend) and **server** (backend) for the Remote Keyboard application. The application allows users to control a shared keyboard remotely in real time.  

### 🛠️ Prerequisites  

Ensure you have the following installed before setting up the project:  
- **Node.js** (v16+ recommended)  
- **MongoDB** (running locally)  
- **Git**  

---

## 🚀 Setup Instructions  

### 1️⃣ Clone the Repository  
```sh
git clone git@github.com:Lavin-kulal/remote-keyboard.git
cd remote-keyboard
```

### 2️⃣ Install Dependencies  

#### Install dependencies for both client and server:  
```sh
cd Client
npm install
cd ../Server
npm install
```

### 3️⃣ Configure Environment Variables  

In the **Server** directory, create a `.env` file and add the following variables:  
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/remote-keyboard
NODE_ENV=development
```

> ⚠️ **Do not share your `.env` file publicly!**  

---

## 🎯 Running the Application  

### Start the **Backend** Server  
```sh
cd Server
npm run build
npm run dev-start
```
This starts the backend on `http://localhost:8080`.  

### Start the **Frontend**  
```sh
cd Client
npm start
```
The frontend will run on `http://localhost:3000` by default.  

---

## 💁‍♂️ Project Structure  

```
remote-keyboard/
├── Client-keyboard-fe/  # Frontend React application
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page views
│   │   ├── services/    # API calls
│   │   ├── App.tsx      # Main App component
│   │   ├── index.tsx    # Entry point
│   ├── package.json     # Frontend dependencies
│   ├── README.md        # Documentation
│
├── Server/              # Backend Node.js application
│   ├── src/             # Source code
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── index.ts     # Server entry point
│   ├── .env             # Environment variables
│   ├── tsoa.json        # API documentation config
│   ├── Dockerfile       # Containerization config
│   ├── package.json     # Backend dependencies
│   ├── README.md        # Documentation
│
├── .gitignore           # Ignore unnecessary files
├── README.md            # Main documentation
```

---

## 🔥 Available Scripts  

### Client  
- `npm start` → Runs the frontend in development mode  
- `npm run build` → Builds the frontend for production  

### Server  
- `npm run dev` → Runs the backend with hot reload  
- `npm run build` → Compiles TypeScript to JavaScript  
- `npm start` → Starts the production server  

---

## 🛠️ Troubleshooting  

### ❌ **Port Already in Use**  
- If `3000` or `8080` is occupied, try changing the ports in `.env` or package.json scripts.  

### ❌ **MongoDB Connection Issues**  
- Ensure MongoDB is running:  
  ```sh
  mongod
  ```  
- Check the `.env` file for the correct `MONGODB_URI`.  

### ❌ **Module Not Found Errors**  
- Delete `node_modules` and reinstall dependencies:  
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 🤝 Contributing  

Contributions are welcome! Feel free to open an issue or submit a pull request.  

---

## 💎 Contact  

For any questions or support, contact **Lavin Kulal** at `laveenk0032@gmail.com`.  

---

