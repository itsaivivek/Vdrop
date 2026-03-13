# Vdrop - Your Personal Cloud Storage

**Vdrop** is a full-stack web app that works like a simple Google Drive.  
You can sign up, log in safely, upload files, download them, see your total storage used, and check when you last uploaded something.  

Files are stored securely in **Appwrite** (switched from Firebase), while user data and file info live in **MongoDB**. Built with Express + EJS for easy learning.

<p align="center">
  <img src="./img/Screenshot%202026-03-11%20at%2020-11-32%20Vdrop.png" width="40%" />
  <img src="./img/Screenshot%202026-03-11%20at%2020-12-15%20Vdrop.png" width="40%" />
  <img src="./img/Screenshot%202026-03-11%20at%2020-11-49%20.png" width="40%" />
  <img src="./img/Screenshot%202026-03-11%20at%2020-12-02%20.png" width="40%" />
</p>

## ✨ Features
- Secure signup and login (passwords are hashed)
- Upload any file type
- Download files with correct name and format
- Dashboard shows:
  - Your files list
  - Total storage used (e.g., "1.2 MB")
  - Recent upload time ("Today at 3:45 PM", "Yesterday", or full date)
- Beautiful responsive design with Tailwind CSS + Flowbite
- Only logged-in users can see their files

## 🛠 Technologies & Packages (and what they do)

- **Express.js** — Main web server and routing (handles /home, /upload, /download).
- **EJS** — Builds dynamic HTML pages (shows your files on the dashboard).
- **Mongoose** — Connects to MongoDB and defines clean data models for users and files.
- **node-appwrite** — Talks to Appwrite cloud storage to actually upload and download real files.
- **Multer** — Catches files from the upload form and keeps them in memory (so we can send them straight to Appwrite).
- **bcrypt** — Hashes passwords so they stay safe even if someone sees the database.
- **jsonwebtoken** — Creates secure login tokens.
- **cookie-parser** — Reads the login token from the browser cookie.
- **express-validator** — Checks form data (email format, password length) before saving.
- **dotenv** — Loads secret keys from the .env file.
- **Custom formatBytes** — Turns raw bytes into easy-to-read sizes (used in dashboard).

## 📁 File Structure & Code Explanation

```
Vdrop/
├── app.js                    # Starts everything. Sets up Express, EJS, connects to DB, loads routes, serves static files, and makes formatBytes available to all templates.
├── package.json              # Lists every package we use and the "npm start" command.
├── .env                      # Secret keys (not pushed to GitHub).
├── config/
│   ├── db.js                 # Connects the app to MongoDB.
│   ├── appwrite.config.js    # Creates the Appwrite client and storage service using your keys.
│   └── multer.config.js      # Sets up Multer with memory storage (so req.file.buffer is ready for Appwrite).
├── middlewares/
│   └── authe.js              # Checks the JWT cookie. If valid, adds user info to req.user. Protects /home, /upload, /download.
├── models/
│   ├── user.model.js         # Defines user data (username, email, hashed password) with basic length checks.
│   └── file.models.js        # Stores file metadata (userId, Appwrite fileId, name, size, upload date).
├── routes/
│   ├── user.routes.js        # Register & login pages + forms. Validates input, hashes password, creates JWT, sets cookie.
│   └── index.routes.js       # Main logic:
│       • / → landing page
│       • /home → shows files, calculates storage, recent time
│       • /upload → Multer catches file → Appwrite saves it → MongoDB saves metadata
│       • /download/:fileId → Checks you own the file → streams from Appwrite
├── utils/
│   └── formatBytes.js        # Simple helper: converts bytes to "KB", "MB", "GB" (used on dashboard).
├── views/                    # EJS templates (what the user sees)
│   ├── index.ejs             # Welcome/landing page
│   ├── register.ejs          # Signup form
│   ├── login.ejs             # Login form
│   ├── home.ejs              # Dashboard with stats cards, file grid, upload button (uses Tailwind + Flowbite)
│   └── temp.ejs              # Temporary/test template
├── public/                   # Static files (favicon.ico)
└── img/                      # Website Screenshots
```

Everything is neatly separated — configs for settings, models for data, routes for logic, middleware for security.

## 🚀 How to Run Locally

### What you need
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Free Appwrite account (https://cloud.appwrite.io)

### Step-by-step

1. **Clone the repo**
   ```bash
   git clone https://github.com/itsaivivek/Vdrop.git
   cd Vdrop
   ```

2. **Install packages**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root folder:
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=make_this_very_long_and_random
   END_POINT=https://cloud.appwrite.io/v1
   PROJECT_ID=your_appwrite_project_id
   API_KEY=your_appwrite_api_key
   BUCKET_ID=your_appwrite_bucket_id
   ```

   **Quick Appwrite setup**:
   - Create a new project
   - Go to Storage → Create a bucket (copy the Bucket ID)
   - Copy Project ID and create an API Key (give it Storage permissions)

4. **Start the app**
   ```bash
   npm start
   ```
   (It uses nodemon so changes reload automatically)

5. Open **http://localhost:3000** in your browser  
   → Register → Login → Upload files → Enjoy!

## 🤝 How to Contribute

Want to help improve Vdrop? Great!

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-idea`
3. Make your changes and test locally
4. Commit: `git commit -m "Add amazing feature"`
5. Push and open a Pull Request

**Easy things you can add**:
- Delete file button
- Search box
- File preview (images/PDF)
- Folders
- Logout button
- Better error messages

Open an issue first if it's a big change. Follow the existing code style and add comments!

## License
MIT License (see LICENSE file)

---

Made with ❤️ by Vivek  
Feel free to use, learn from, and improve this project!
