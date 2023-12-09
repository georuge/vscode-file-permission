import * as vscode from "vscode";
import * as lodash from "lodash";

import { IApplication } from "./type";
import { ChangePermissionCommand } from "./commands";
import { PermissionStatusBar } from "./ui/bar";

export class Application implements IApplication {
  _name: string;
  _status: PermissionStatusBar;
  _waitTimeToDebounce: number = 100;

  constructor() {
    this._name = vscode.env.appName;
    this._status = new PermissionStatusBar();
  }

  get name() {
    return this._name;
  }

  init = async (context: vscode.ExtensionContext) => {
    const changePermissionCommand = new ChangePermissionCommand(
      "change-permission"
    );

    // Register disposals
    context.subscriptions.push(
      changePermissionCommand.register(this.updateStatusWithActiveFile)
    );
    context.subscriptions.push(this._status.init(1, changePermissionCommand));

    // Register event listener
    vscode.window.tabGroups.onDidChangeTabs(this.updateStatusWithActiveFile);

    // First view
    this.updateStatusWithActiveFile();
  };

  fini = () => {
    if (this._status) {
      this._status.show(false);
    }
  };

  /**
   * Update permission status with current active file
   */
  updateStatusWithActiveFile = lodash.debounce(async () => {
    const { activeTab } = vscode.window.tabGroups.activeTabGroup;
    if (!activeTab) {
      this._status.show(false);
      return;
    }

    const { uri } = activeTab.input as { uri: vscode.Uri };
    this._status.update(uri.path);
    this._status.show();
  }, this._waitTimeToDebounce);
}
