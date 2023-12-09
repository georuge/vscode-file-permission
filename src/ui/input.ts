import * as vscode from "vscode";

/**
 * Show input box
 *
 * @param placeholder
 * @param validate validate input value
 * @returns input value. undefined means to escape or invalid value
 */
export const showInputBox = async (
  placeholder: string,
  validate?: (value: string | void) => boolean
) => {
  let inputValue: string = "";
  let value: string | undefined = "";

  const inputBox = vscode.window.createInputBox();
  inputBox.placeholder = placeholder;

  const inputPromise = new Promise<string | undefined>((resolve, reject) => {
    inputBox.onDidChangeValue((e) => (inputValue = e));
    inputBox.onDidAccept(() => resolve(inputValue));
    inputBox.onDidHide(() => resolve(undefined)); // when escaped
  });

  inputBox.show();
  try {
    value = await inputPromise;
    if (validate && !validate(value)) {
      // invalid value
      value = undefined;
    }
  } finally {
    inputBox.dispose();
  }

  return value;
};
