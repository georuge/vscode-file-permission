// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { Application } from "./application";

let app: Application | undefined;

export function activate(context: vscode.ExtensionContext) {
  app = new Application(context);
  app.init();
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (app) {
    app.fin();
  }
}
