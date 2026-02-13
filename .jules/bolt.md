## 2024-05-22 - Duplicated Codebase for App Logic
**Learning:** The application logic for `ElmarApp` exists in both `app.js` and inline within `index.html`. `index.html` is the production source (inline script), while `app.js` appears to be a mirror used for testing (Jest).
**Action:** When modifying application logic, changes must be applied to both `index.html` (for the live app) and `app.js` (for tests). Always verify which file is being served to the user.
