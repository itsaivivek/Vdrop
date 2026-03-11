# Vdrop - Your Personal Cloud Storage

Vdrop is a simple full-stack web app that works like **Google Drive**.  
You can sign up, log in, upload files, download them, see how much storage you used, and check your most recent upload time.  
It is built for learning and personal use.

<p align="center">
  <img src="./img/Screenshot%202026-03-11%20at%2020-11-32%20Vdrop.png" width="40%" />
  <img src="./img/Screenshot%202026-03-11%20at%2020-12-15%20Vdrop.png" width="40%" />
  <img src="./img/Screenshot%202026-03-11%20at%2020-11-49%20.png" width="40%" />
  <img src="./img/Screenshot%202026-03-11%20at%2020-12-02%20.png" width="40%" />
</p>


## Features

- User signup and login (with secure password + JWT cookie)
- Upload files (any type, stored in Appwrite bucket)
- Download files (with correct file name and type — no corruption)
- See total storage used (in KB / MB / GB)
- Show time of most recent upload (Today, Yesterday, or full date)
- Simple and clean dashboard with Tailwind CSS + Flowbite
- MongoDB to save user info and file details

## Technologies Used

- **Backend**: Node.js + Express.js
- **Frontend**: EJS templates + Tailwind CSS + Flowbite (for nice UI)
- **Database**: MongoDB (Mongoose for user & file models)
- **File Storage**: Appwrite Storage (cloud bucket for real files)
- **File Handling**: Multer (memory storage for uploads)
- **Authentication**: JWT (JSON Web Tokens) stored in httpOnly cookie
- Other: node-appwrite SDK, dotenv, cookie-parser, bcrypt

## Project Structure (How the Code Works)

```
## Project Structure
Vdrop/
├── config/                      # Configuration files
│   ├── config.js
│   ├── appwrite.config.js
│   └── db.js
├── multer.config.js             # Multer setup for file uploads
├── middlewares/                 # Authentication & other middleware
│   └── auth.middleware.js
├── models/                      # Mongoose schemas
│   ├── file.models.js
│   └── user.model.js
├── node_modules/                # (ignored in .gitignore)
├── public/                      # Static files
│   └── favicon.ico
├── routes/                      # All route handlers
│   ├── index.routes.js          # Main routes (home, upload, download...)
│   └── user.routes.js           # Auth routes (login, signup...)
├── utils/                       # Helper functions
│   └── formatBytes.js
├── views/                       # EJS templates
│   ├── home.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── temp.ejs
├── .env                         # Environment variables (never commit!)
├── .gitignore
├── app.js                       # Main Express app entry point
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

### Important Code Parts (Simple Explanation)

- **app.js**  
  Starts the server, connects to MongoDB, sets EJS as view engine, serves static files from `/public`, uses cookie-parser and routes.

- **models/file.models.js**  
  Saves info about each file: userId, fileId (from Appwrite), fileName, fileSize, uploadedAt date.

- **routes/index.routes.js**  
  - `/` → home or redirect to login  
  - `/signup`, `/login` → create/login user, set JWT cookie  
  - `/home` → show dashboard with files list, storage used, recent upload time  
  - `/upload` → take file from form → save to Appwrite → save info to MongoDB  
  - `/download/:fileId` → check owner → get file from Appwrite → send to browser correctly  

- **middlewares/authMiddleware.js**  
  Checks JWT cookie → if valid, adds user info to `req.user` → else redirect to login.

- **home.ejs** (dashboard)  
  Shows cards for: number of files, storage used (formatted like 1.2 GB), recent upload (Today / Yesterday / date), list of your files with download buttons.

## .env File (Important Secrets)

You need a `.env` file in the root folder. **Never** push it to GitHub!

Example content:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/vdrop     # or your MongoDB Atlas link
JWT_SECRET=your_very_long_random_secret_here
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key_with_storage_permissions
BUCKET_ID=your_bucket_id_in_appwrite
```

- These passwords, keys, and IDs keep your app secure and connected.
- Get them from: MongoDB Atlas / Appwrite dashboard.

## How to Run on Your Computer

1. **Requirements**  
   - Node.js (v18 or higher)  
   - MongoDB (local or cloud)  
   - Appwrite account & project (with a storage bucket)

2. **Steps**

   ```bash
   # 1. Clone or download the repo
   git clone https://github.com/itsaivivek/Vdrop.git
   cd Vdrop

   # 2. Install packages
   npm install

   # 3. Create .env file (copy from below or make your own)
   # Use the example above

   # 4. Start the app
   npm start
   # or if you use nodemon (recommended for development)
   npm run dev    # (add "dev": "nodemon app.js" to package.json scripts if missing)
   ```

3. Open browser → go to `http://localhost:3000`

4. **Test it**  
   - Sign up → login  
   - Upload some files (images, pdf, etc.)  
   - Check dashboard: storage used should update, recent upload shows correct time  
   - Click download → file should open correctly (no error/corrupted)

## How to Contribute

Want to help improve Vdrop? Great!

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make changes (add delete button, folders support, search, etc.)
4. Commit: `git commit -m "Added file delete feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request here

Ideas to add:
- File delete option
- Folders / directories
- File preview (images/pdf)
- Share links
- Dark mode toggle
- File search

Feel free to open issues or PRs anytime!