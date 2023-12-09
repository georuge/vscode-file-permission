import * as vscode from "vscode";

export interface IApplication {
  /**
   * Application name
   */
  name: string;
  /**
   * Application initialize process
   *
   * @param context
   */
  init: (context: vscode.ExtensionContext) => void;
  /**
   * Application finalize process
   */
  fini: () => void;
}
