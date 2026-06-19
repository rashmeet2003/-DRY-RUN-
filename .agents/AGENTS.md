# Project Workspace Rules: DryRun DSA Logic Studio

This file contains the persistent context, architecture guidelines, and run instructions for the **DryRun** project. Antigravity automatically loads this workspace config whenever the user works inside this directory.

---

## Project Overview
**DryRun** is a full-stack, gamified DSA logic visualizer designed to teach pointer-based coding algorithms (e.g., LeetCode 11: Container with Most Water) and debugging logic.

- **Frontend:** Vanilla HTML5, CSS3 (responsive grid, custom themes, visualizers), and ES6 JavaScript.
- **Backend:** Java 21, Spring Boot (3.3.0), Spring Data JPA, Hibernate.
- **Database:** H2 Database (in-memory relational db, console enabled at `/h2-console`).

---

## Workspace Directory Structure
- `/frontend` - Client application source (runs on port `8000`).
  - `index.html` - Dual-layout dashboard & simulated mobile frame.
  - `style.css` - UI layout, gradients, themes (Cyberpunk, Emerald, Fusion).
  - `app.js` - Dynamic DOM interactions, API integrations, and local mock fallback.
- `/backend` - REST API application source (runs on port `8080`).
  - `pom.xml` - Maven configuration and dependencies.
  - `src/main/java/` - Java Spring Boot application files.
  - `src/main/resources/application.properties` - H2 database & port configurations.
- `.agents/AGENTS.md` - Persistent agent instructions (this file).

---

## Running the Project Local Servers

### 1. Start the Frontend Server (Port 8000)
Run in PowerShell:
```powershell
python -m http.server 8000 --directory C:/Users/hp/FOLDERS/DryRun/frontend
```
Access at: `http://localhost:8000`

### 2. Start the Backend Server (Port 8080)
Navigate to `/backend` and run:
```powershell
mvn spring-boot:run
```
Access H2 DB Console at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:dryrundb`, Username: `sa`, Password: `password`)

---

## API Endpoints Reference
- `GET /api/stats` - Fetches user XP, streak, and heart count.
- `GET /api/lesson/step/{stepNumber}` - Fetches pointer indexes and options for step `N`.
- `POST /api/lesson/validate` - Validates submitted answer choice (`A` or `B`) for the active step.
- `POST /api/reset` - Resets H2 database progress to initial seeding defaults.

---

## Agent Pair-Programming & Teaching Guidelines
When working with the user on this project, adhere to these principles:
1. **Be a Mentor:** Act as a patient teacher and guide. Explain the *what, how, and why* behind any backend Java logic or frontend UI changes you make.
2. **Prioritize Code Explanations:** Before introducing a new feature or debugging an issue, walk the user through the relevant Java class, Spring annotations, or DOM queries so they learn the technology stack.
3. **Responsive Visual design:** Keep UI elements polished, modern, and high-fidelity (vibrant gradient glows, modern typography, fast micro-animations). Ensure compatibility in both Desktop and Mobile views.
4. **Offline Resilience:** Maintain the local JS fallbacks in `app.js` so the frontend remains functional even when the Spring Boot API is stopped.
