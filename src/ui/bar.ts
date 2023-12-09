import * as vscode from "vscode";
import { PathLike } from "fs";

import { ICommand } from "../commands";
import { FilePermission, PermissionType, getUsername } from "../utils";

export class PermissionStatusBar {
  _bar: vscode.StatusBarItem | undefined;
  _filePermission: FilePermission | undefined;

  constructor() {}

  init = (priority: number = 10, command: ICommand | undefined = undefined) => {
    this._bar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      priority
    );

    if (command) {
      this._bar.command = command.id;
      console.debug(`register command ${command.id} to PermissionStatusBar`);
    }

    console.info("initialized PermissionStatuBar");
    return this._bar;
  };

  fini() {
    if (!this._bar) {
      console.warn(
        "ignored finilized PermissionStatusBar becuase finalized already"
      );
      return;
    }

    this._bar.dispose();
    this._bar = undefined;
    this._filePermission = undefined;
    console.info("finalized PermissionStatuBar");
  }

  toStatusString = ({ read, write, execute }: PermissionType) => {
    const readLetter = read ? "R" : "";
    const writeLetter = write ? "W" : "";
    const executeLetter = execute ? "X" : "";
    return `${readLetter}${writeLetter}${executeLetter}`;
  };

  update = async (fileName: PathLike) => {
    if (!this._bar) {
      console.warn(
        "ignored update PermissionStatusBar becuase finalized already"
      );
      return;
    }

    const currentFile = this._filePermission?.path();
    this._filePermission = new FilePermission(fileName);
    console.debug(`updated file = '${currentFile}' -> ${fileName}`);

    await this._filePermission.update();
    const permissions = this._filePermission.getPermissions();
    const currentText = this._bar.text;
    const nextText = `${this._filePermission.text()} (${getUsername()})`;
    console.debug(`updated permission text '${currentText}' -> '${nextText}'`);

    this._bar.text = nextText;
  };

  show(isShow: boolean = true) {
    if (!this._bar) {
      console.warn(
        "ignored show PermissionStatusBar becuase finalized already"
      );
      return;
    }
    isShow ? this._bar.show() : this._bar.hide();
  }
}
