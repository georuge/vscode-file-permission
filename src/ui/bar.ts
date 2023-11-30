import * as vscode from "vscode";

export class StatusBar {
  private _bar: vscode.StatusBarItem;

  constructor(name: string, priority: number = 0) {
    this._bar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      priority
    );
    this._bar.hide();
  }

  update(text: string) {
    this._bar.text = text;
  }

  show(isShow: boolean = true) {
    isShow ? this._bar.show() : this._bar.hide();
  }
}
