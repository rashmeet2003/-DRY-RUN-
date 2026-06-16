# ⚡ DryRun // Full-Stack Gamified DSA Logic Builder

**DryRun** (or **AlgoTrace**) is a full-stack, gamified mobile-web application designed for developers to build and test their Data Structures and Algorithms (DSA) logic—similar to Duolingo but built specifically for coding problem breakdowns. 

Instead of writing syntax, users visual-debug step-by-step pointers (e.g., Left and Right bounds) for algorithmic problems like **LeetCode 11 (Container With Most Water)**, compete in rapid-fire **Code Duels** (debugging loops), and earn XP and save streaks stored directly in a backend database.

---

## 🏗️ Project Architecture & Tech Stack

The application is built using a clean, decoupled full-stack architecture:

```text
dryrun-app/
├── backend/                       # REST API Backend (Java Spring Boot)
│   ├── pom.xml                    # Maven Configuration
│   └── src/main/java/com/dryrun/
│       ├── controller/            # REST Controllers (Handles REST requests & CORS)
│       ├── model/                 # JPA Entities (Database Tables Schema)
│       ├── repository/            # JpaRepository Interfaces (SQL Database Queries)
│       └── config/                # Seeding Initial Data & H2 Configs
│
└── frontend/                      # Gamified Client Dashboard (HTML5, CSS3, ES6)
    ├── index.html                 # Grid & Mobile emulator viewport layouts
    ├── style.css                  # Cyberpunk dark styling & glassmorphism filters
    └── app.js                     # Async Client Controller (makes fetch API calls)
```

### 💻 Technologies Used
* **Java 17/21 & Spring Boot 3.x:** Core REST API services.
* **Spring Data JPA & Hibernate:** ORM mapping to bridge Java objects with database tables.
* **H2 Database (In-Memory):** Embedded SQL database requiring **zero local installation/setup**—perfect for rapid evaluations and recruiters.
* **HTML5, CSS3 (Vanilla), JavaScript (ES6):** Sleek, dark cyberpunk theme with responsive layouts and hover glow micro-interactions.

---

## ⚡ API Endpoints Documentation

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Fetches the current user stats (XP, Streak, Hearts). |
| `POST` | `/api/reset` | Resets user stats and re-seeds starting progress data. |
| `GET` | `/api/lesson/step/{stepNum}` | Retrieves pointer coordinates, question, and selections for the LeetCode 11 lesson step. |
| `POST` | `/api/lesson/validate` | Validates a step submission, updates database stats (adds XP or removes heart), and returns explanations. |

---

## 🚀 Step-by-Step Launch Instructions

Follow these simple steps to run the full-stack app on your local machine:

### 1. Run the Spring Boot Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Build and run the app using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on **`http://localhost:8080`**.
4. **Inspect H2 Database:** Visit **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)** in your browser.
   * JDBC URL: `jdbc:h2:mem:dryrundb`
   * Username: `sa`
   * Password: `password`
   * Click **Connect** to run SQL queries like `SELECT * FROM USER_STATS;` directly!

### 2. Launch the Frontend Dashboard
1. Open the [frontend/index.html](file:///C:/Users/hp/.gemini/antigravity/scratch/dryrun-app/frontend/index.html) file directly in your browser or serve it using any simple local HTTP server (like VS Code Live Server or Python):
   ```bash
   cd frontend
   python -m http.server 8000
   ```
2. Visit **`http://localhost:8000`** in your browser.
3. Observe the live connection: The logs in the left sidebar console will automatically report:
   `[API] Fetched stats: Streak 12, XP 350, Hearts 5`

---

## 🛡️ SDE Portfolio Customization Tips (For Job Seekers)

If you are a student or developer applying for software engineering internships or roles, here are modifications you can make to showcase deep engineering knowledge on your GitHub:

1. **Switch H2 to PostgreSQL:**
   To show production database expertise, run PostgreSQL locally (or via Docker) and swap the database connection details in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5412/dryrundb
   spring.datasource.username=your_postgres_user
   spring.datasource.password=your_postgres_password
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```
2. **Add Spring Security JWT Login:**
   Implement user registration and authentication controllers instead of hardcoding `Developer1` to showcase modern API security methods.
3. **Integrate Real Code Compilation (Judge0):**
   Connect a code compiler microservice (e.g., using Judge0 API) to compile and execute actual Java code submitted in Code Duels!
