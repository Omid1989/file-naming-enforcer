import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { minimatch } from "minimatch";

export function activate(context: vscode.ExtensionContext) {
  const log = vscode.window.createOutputChannel("File Naming Enforcer");
  log.show(true);
  log.appendLine("Extension Activated");

  vscode.window.showInformationMessage("File Naming Enforcer Activated!");

  const watcher = vscode.workspace.createFileSystemWatcher("**/*");

  watcher.onDidCreate(async (uri) => {
    log.appendLine(`Detected creation: ${uri.fsPath}`);

    let config = loadProjectConfig(log);
    if (!config.rules) {
      log.appendLine("No rules found in config. Skipping rename.");
      return;
    }

    await applyNamingRules(uri, config, log);
  });

  context.subscriptions.push(watcher);
}

// --- اعمال قوانین نامگذاری ---
async function applyNamingRules(
  uri: vscode.Uri,
  config: any,
  log: vscode.OutputChannel
) {
  if (!vscode.workspace.workspaceFolders) return;

  try {
    const stats = await vscode.workspace.fs.stat(uri);
    const fileName = path.basename(uri.fsPath);
    const isDirectory = stats.type === vscode.FileType.Directory;

    log.appendLine(`Checking name for: ${fileName}`);

    const rules = config.rules || {};
    const presetRules = getPresetRules(config.preset || "");
    const allRules = { ...presetRules, ...rules };
    const renameMode = config.rename || "ask";

    const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const relativePath = path.relative(root, uri.fsPath);

    for (const pattern in allRules) {
      if (minimatch(relativePath, pattern)) {
        const rule = allRules[pattern];
        const correctName = applyRule(fileName, rule);

        if (fileName !== correctName) {
          if (renameMode === "auto") {
            const newUri = vscode.Uri.file(
              path.join(path.dirname(uri.fsPath), correctName)
            );
            await vscode.workspace.fs.rename(uri, newUri, { overwrite: false });
            vscode.window.showInformationMessage(
              `${
                isDirectory ? "Folder" : "File"
              } renamed to ${correctName} (auto)`
            );
            log.appendLine(`Auto renamed ${fileName} → ${correctName}`);
          } else {
            const choice = await vscode.window.showWarningMessage(
              `${
                isDirectory ? "Folder" : "File"
              } "${fileName}" does not follow ${rule}. Rename to "${correctName}"?`,
              "Yes",
              "No"
            );
            if (choice === "Yes") {
              const newUri = vscode.Uri.file(
                path.join(path.dirname(uri.fsPath), correctName)
              );
              await vscode.workspace.fs.rename(uri, newUri, {
                overwrite: false,
              });
              vscode.window.showInformationMessage(`Renamed to ${correctName}`);
              log.appendLine(`User renamed ${fileName} → ${correctName}`);
            }
          }
        } else {
          log.appendLine(`Name "${fileName}" is already correct`);
        }
      }
    }
  } catch (err) {
    log.appendLine(`Error in applyNamingRules: ${err}`);
  }
}

// --- لود کردن config پروژه ---
function loadProjectConfig(log?: vscode.OutputChannel): any {
  if (!vscode.workspace.workspaceFolders) return {};
  const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const configPath = path.join(root, "file-naming.config.json");

  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      log?.appendLine("Loaded file-naming.config.json successfully.");
      return JSON.parse(raw);
    } catch {
      vscode.window.showErrorMessage("Error parsing file-naming.config.json");
      log?.appendLine("Error parsing file-naming.config.json");
      return {};
    }
  } else {
    log?.appendLine("file-naming.config.json not found.");
    return {};
  }
}

// --- قوانین پیش‌فرض preset ---
function getPresetRules(preset: string): Record<string, string> {
  switch (preset) {
    case "react":
      return {
        "components/*/": "PascalCase",
        "components/**/*.tsx": "PascalCase",
        "components/**/hooks/": "camelCase",
        "components/**/hooks/*.ts": "camelCase",
        "*.css": "kebab-case",
      };
    case "laravel":
      return {
        "app/Models/*.php": "PascalCase",
        "app/Http/Controllers/*.php": "PascalCase",
        "resources/views/**/*.blade.php": "snake_case",
        "public/css/*.css": "kebab-case",
        "public/js/*.js": "camelCase",
      };
    default:
      return {};
  }
}

// --- تبدیل نام‌ها ---
function applyRule(fileName: string, rule: string): string {
  const ext = path.extname(fileName);
  const base = fileName.replace(ext, "");
  switch (rule) {
    case "PascalCase":
      return toPascalCase(base) + ext;
    case "camelCase":
      return toCamelCase(base) + ext;
    case "kebab-case":
      return toKebabCase(base) + ext;
    case "snake_case":
      return toSnakeCase(base) + ext;
    default:
      return fileName;
  }
}

function toPascalCase(str: string) {
  return str
    .replace(/[-_ ]+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}
function toCamelCase(str: string) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}
function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

export function deactivate() {}
