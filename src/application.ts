import * as vscode from "vscode";
import { PathLike } from "fs";
import * as lodash from "lodash";

import { StatusBar } from "./ui/bar";
import { getUsername } from "./scripts/utils";
import { FilePermission } from "./scripts/permission";

export class Application {
  _status: StatusBar;

  constructor(context: vscode.ExtensionContext) {
    this._status = new StatusBar(vscode.env.appName);
  }

  /**
   * Initalize application
   */
  async init() {
    vscode.window.onDidChangeActiveTextEditor(this.onChangeFile);
    this.onChangeFile();
  }

  /**
   * Finalize application
   */
  fin() {
    if (this._status) {
      this._status.show(false);
    }
  }

  onChangeFile = () => {
    const { activeTab } = vscode.window.tabGroups.activeTabGroup;
    if (!activeTab) {
      this._status.show(false);
      return;
    }

    const { uri } = activeTab.input as { uri: vscode.Uri };
    this.updateStatus(uri.path);
  };

  /**
   * Update permission status
   *
   * @param fileName target
   */
  updateStatus = lodash.debounce(async (fileName: PathLike) => {
    const permission = new FilePermission(fileName);
    await permission.update();
    this._status.update(`${permission.text()} (${getUsername()})`);
    this._status.show();
  }, 100);
}
