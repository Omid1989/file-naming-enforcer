<!-- STATS BADGE START -->
![Views](https://img.shields.io/badge/Views-805-blue)  ![Clones](https://img.shields.io/badge/Clones-205-green)
<!-- STATS BADGE END -->
# File Naming Enforcer

A Visual Studio Code extension that automatically enforces file and folder naming conventions based on project-specific rules or predefined presets for popular frameworks like **React** and **Laravel**.

## ✨ Features

- **🔄 Automatic Naming Enforcement**: Detects newly created files or folders and renames them according to your defined rules
- **⚙️ Configurable Rules**: Define custom naming rules in a `file-naming.config.json` file at the root of your project
- **📦 Framework Presets**: Built-in presets for popular frameworks:
  - **React**: PascalCase for components, camelCase for hooks, kebab-case for CSS files
  - **Laravel**: PascalCase for models/controllers, snake_case for blade templates, camelCase/kebab-case for JS/CSS
- **🎯 Flexible Rename Modes**:
  - **Auto**: Automatically rename files/folders
  - **Ask**: Prompt the user before renaming

## 🚀 Usage

### 1. Configuration Setup

Create a `file-naming.config.json` file at the root of your project:

```json
{
  "preset": "react",
  "rules": {
    "src/utils/*.ts": "camelCase",
    "components/**/*.tsx": "PascalCase",
    "styles/**/*.css": "kebab-case"
  },
  "rename": "ask"
}
```

**Configuration Options:**

- `preset` (optional): Use `"react"` or `"laravel"` for predefined rules
- `rules` (optional): Custom glob patterns and their naming conventions
- `rename`: `"auto"` or `"ask"` (default: `"ask"`)

### 2. How It Works

When a new file or folder is created, the extension will:

1. Check if the name follows the configured rules
2. If it doesn't comply:
   - **Auto mode**: Automatically rename the file/folder
   - **Ask mode**: Prompt you before renaming

## 📝 Naming Conventions

| Convention     | Description                                           | Example                  |
| -------------- | ----------------------------------------------------- | ------------------------ |
| **PascalCase** | Each word starts with a capital letter, no separators | `MyFileName.tsx`         |
| **camelCase**  | Like PascalCase, but first letter is lowercase        | `myFileName.ts`          |
| **kebab-case** | Lowercase words separated by hyphens                  | `my-file-name.css`       |
| **snake_case** | Lowercase words separated by underscores              | `my_file_name.blade.php` |

## 🎯 Framework Presets

### React Preset

```json
{
  "preset": "react",
  "rules": {},
}
```

- Components: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- Hooks: camelCase (`useFetch.ts`, `useAuth.ts`)
- Styles: kebab-case (`main.css`, `user-profile.css`)
- Utils: camelCase (`helpers.ts`, `apiUtils.ts`)

### Laravel Preset

```json
{
  "preset": "laravel",
  "rules": {},
}
```

- Models/Controllers: PascalCase (`User.php`, `UserController.php`)
- Blade templates: snake_case (`user_profile.blade.php`)
- JavaScript: camelCase (`userUtils.js`)
- CSS: kebab-case (`user-styles.css`)

## 💡 Example Usage

**Configuration:**

```json
{
  "preset": "react",
  "rules": {},
  "rename": "auto"
}
```

**Automatic Renaming Behavior:**

- `components/button/index.tsx` → `components/Button/index.tsx`
- `hooks/useFetch.ts` → `hooks/useFetch.ts` ✓ (already correct)
- `styles/mainStyle.css` → `styles/main-style.css`
- `utils/apihelper.ts` → `utils/apiHelper.ts`

## 🛠️ Development

### Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Commit** your changes: `git commit -m "Add feature"`
4. **Push** to the branch: `git push origin feature-name`
5. **Open** a pull request

### Local Development

1. Clone the repository
2. Run `npm install` to install dependencies
3. Open in VS Code
4. Press `F5` to launch the extension in development mode

## 📄 License

MIT License 

## 🤝 Support


|**Made with ❤️ for developers who care about consistent code organization**


