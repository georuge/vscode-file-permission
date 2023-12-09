import * as vscode from "vscode";
import { Mode, PathLike } from "fs";

import { ICommand } from "./ICommand";
import { changePermission } from "../utils";
import { showInputBox } from "../ui/input";

export class ChangePermissionCommand extends ICommand {
  proceed = async (...args: any[]) => {
    let path: PathLike | undefined = args[0];

    const { activeTab } = vscode.window.tabGroups.activeTabGroup;
    if (!path && activeTab) {
      const { uri } = activeTab.input as { uri: vscode.Uri };
      path = uri.path;
    }

    if (!path) {
      console.debug(`${this.id}: ${{ path, activeTab, args }}`);
      vscode.window.showErrorMessage("Target path is not specified");
      return;
    }

    const value = await showInputBox("Change mode: (e.g. 0644)");
    if (!value) {
      return;
    }

    try {
      await changePermission(path!, value as Mode);
    } catch (err: unknown | Error) {
      let message: string = `${err}`;
      if (err instanceof Error) {
        message = err.message;
      }
      vscode.window.showWarningMessage(`${this.id}: failed. err=${message}`);
    }
  };
}
