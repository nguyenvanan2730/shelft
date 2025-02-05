# 🛠 Git workflow for SALT-OPINIONS project

## **1. Branch Guidelines**

Our project uses 3 different branches: **feature**, **develop**, and **main**. Here's how to use them:

### - **feature**: for individual tasks
- Each developer should create their own feature branch for each task they are working on.  
- Branch Naming Format:
  `feature/{developer name}/task_content`  
  - Example: `feature/annv/add-login-function`  
---

### - **develop**: for ongoing development  
- All completed coding in your `feature` branches, your code should be merged from `feature` branch into the `develop` branch to collaborate with other members.
---

### - **main**: for the latest production code  
- After successful testing on the **develop** branch, code will be merged from `develop` into the `main` branch.  

---

### **Merge Flow:**  
The flow of our project should follow: `feature` → `develop` → `main`


## 2. **Commit Message Guidelines**  
Follow these rules for clear and consistent commit messages:  

- Start with a **prefix** chosen from the list below.  
- Use **lowercase** for the prefix.  
- Put a **colon** and a **space** after the prefix.  

---

#### **Prefixes and When to Use Them**  

- **feat**: For new features or functions.  
  - _Example_: `feat: Add password reset function`  

- **fix**: For fixing bugs or issues.  
  - _Example_: `fix: Fix missing data on the dashboard`  

- **refactor**: For code improvements without changing how it works.  
  - _Example_: `refactor: Move helper functions to a new file`  

- **chore**: For updates like maintenance, tools, or dependencies.  
  - _Example_: `chore: Update Node.js version in Dockerfile`  

- **docs**: For documentation changes.  
  - _Example_: `docs: Add examples to the README`  


## 3. Pull Request Guideline: Merging `feature` branch into `develop` branch

After completing your work on the `feature` branch, you should create a pull request to merge your code into the `develop` branch. This pull request can be created manually on GitHub by following the guide below:

---

### **PR Title**
The title should summarize the purpose of the pull request. Ideally, it matches the feature branch name or briefly describes the task.

#### **Examples:**
- `fix: Resolve issue with data duplicate in user profile`

---

### **PR Description**
Provide a clear explanation of the changes made, and any additional information that can help the reviewer. Mention the links of this task from Trello
#### **Examples:**
- `Updates using transaction locks.`
- `Added API checks, validation for email and user_id, and improved test coverage.`
- `https://trello.com/c/ffbDB1zD/17-「login」-functions` 

## **Add reviewer**
The reviewer will review your pull request and merge it into the `develop` branch if no issues are found.
At least 2 people should be choosen as reviewer