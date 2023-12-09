import * as vscode from "vscode";

export abstract class ICommand {
  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  /**
   * Main process
   */
  abstract proceed(...args: any[]): Promise<any>;

  /**
   * Register command
   */
  register = (extra?: (result: any) => void) =>
    vscode.commands.registerCommand(this._id, async (...args: any[]) => {
      const result = await this.proceed(...args);
      if (extra) {
        extra(result);
      }
    });
}
