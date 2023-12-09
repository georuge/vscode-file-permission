import * as vscode from "vscode";

import { Application } from "./application";

let app: Application | undefined;

export function activate(context: vscode.ExtensionContext) {
  app = new Application();
  app.init(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (app) {
    app.fini();
  }
}
