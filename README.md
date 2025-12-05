# ResumeCraft AI

Welcome to **ResumeCraft AI**—the web application that transforms your professional profile into a perfectly tailored, ATS-optimized resume and cover letter using the power of Generative AI.

This project was bootstrapped with [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

![Job4You Screenshot](https://github.com/SherazHussain546/Job4You/blob/main/images/screenshot.png?raw=true)

## ✨ Core Features

-   **Secure Authentication**: Sign in with Google, email, or explore anonymously.
-   **Intuitive Profile Editor**: Easily manage your education, experience, projects, certifications, and skills in a clean dashboard.
-   **AI-Powered Tailoring**: Paste any job description, and our AI will analyze your profile to generate a custom-tailored resume and cover letter in professional LaTeX format.
-   **Instant PDF Generation**: Use the embedded Overleaf editor to compile your documents into polished, downloadable PDFs without leaving the app.
-   **Modern Tech Stack**: Built with Next.js, React, Tailwind CSS, and powered by Genkit for AI and Firebase for the backend.

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org/) project. To get it running locally, follow these steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SherazHussain546/Job4You.git
    cd Job4You
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Firebase project configuration keys.

4.  **Create Firestore Index (Required for Job Board):**
    For the community job board to work, you need to create a composite index in Firestore. When you run the app and visit the community page, you will see an error in your browser's developer console containing a link to create the index.
    
    a. Run the app (`npm run dev`).
    b. Open the developer console.
    c. Find the error message starting with `FirebaseError: ... The query requires an index.`
    d. Click the link provided in the error message. It will take you directly to the Firebase console to create the required index.
    e. Click "Create Index." The creation process may take a few minutes.

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 📄 License

This project is open-source under the MIT License. Feel free to fork, contribute, and improve!
