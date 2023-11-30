import { access, constants, PathLike } from "fs";

type PermissionType = {
  read: boolean;
  write: boolean;
  execute: boolean;
};

/**
 * Access file asynchronously
 *
 * @param path Target file
 * @param mode Permission mode to access
 *
 * @returns Permited or not
 */
const accessAsync = (path: PathLike, mode: number) => {
  return new Promise<boolean>((resolve) => {
    access(path, mode, (err) => (err ? resolve(false) : resolve(true)));
  });
};

export class FilePermission {
  private _path: PathLike;
  private _hasRead: boolean;
  private _hasWrite: boolean;
  private _hasExecute: boolean;

  constructor(path: PathLike) {
    this._path = path;
    this._hasRead = false;
    this._hasWrite = false;
    this._hasExecute = false;
  }

  get path(): PathLike {
    return this._path;
  }

  /**
   * Permission text
   *
   * @returns Show the symbols if allowed
   */
  text(): string {
    return (
      `${this._hasRead ? "R" : ""}` +
      `${this._hasWrite ? "W" : ""}` +
      `${this._hasExecute ? "X" : ""}`
    );
  }

  /**
   * Get permissions
   *
   * @returns have or not each permmissions
   */
  permissions(): PermissionType {
    return {
      read: this._hasRead,
      write: this._hasWrite,
      execute: this._hasExecute,
    } as const;
  }

  /**
   * Get current permissions
   */
  async update() {
    const [hasRead, hasWrite, hasExecute] = await Promise.all([
      accessAsync(this._path, constants.R_OK),
      accessAsync(this._path, constants.W_OK),
      accessAsync(this._path, constants.X_OK),
    ]);

    this._hasRead = hasRead;
    this._hasWrite = hasWrite;
    this._hasExecute = hasExecute;
  }
}
