import path = require('path');
import * as vscode from 'vscode';
import { cp_exec } from '../utils';
import YAML = require('yamljs');

type ConanExtensionConfig = {
  installArgs: Array<string>;
};

export type ConanfileDependency = {
  headers: boolean,
  libs: boolean,
  ref: string,
};

export type Dependency = {
  options?: Record<any, any>,
  dependencies?: Record<any, ConanfileDependency>
};

export type ConanGraphInfo = {
  [key: string]: Dependency
} & {
  conanfile?: {
    dependencies?: Record<any, ConanfileDependency>,
  },
};

export class Env {
  workspacePath: string | undefined = undefined;
  conanfilePath: string | undefined = undefined;
  conanVersion: string | undefined = undefined;
  configuration: vscode.WorkspaceConfiguration | undefined = undefined;

  constructor(context: vscode.ExtensionContext) {
    if (vscode.workspace.workspaceFolders) {
      this.workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      this.conanfilePath = path.resolve(this.workspacePath, 'conanfile.txt');

      this.configuration = vscode.workspace.getConfiguration("conan-extension");
      vscode.workspace.onDidChangeConfiguration(() => {
        this.configuration = vscode.workspace.getConfiguration("conan-extension");
      });
    }
  }

  getConfig<T extends keyof ConanExtensionConfig>(key: T): ConanExtensionConfig[T] | undefined {
    return this.configuration?.get(key);
  }

  async getConanGraphInfo(): Promise<ConanGraphInfo> {
    const stdout = await cp_exec('conan graph info . 2>&1', {
      cwd: this.workspacePath,
    });
    const graphYAML = stdout.split(/.*Basic.*graph.*information.*/)[1];

    let json: ConanGraphInfo = {};
    try {
      json = YAML.parse(graphYAML);
    } catch (e) {
      vscode.window.showErrorMessage(`Load conan graph info failed, ${e}`);
    }

    return json;
  }

  async getConanEnv(context: vscode.ExtensionContext): Promise<boolean> {
    if (this.conanVersion === undefined) {
      try {
        const stdout = await cp_exec('conan --version');
        this.conanVersion = /\d+(\.\d+)*/.exec(stdout)?.[0];
      } catch {
        vscode.window.showErrorMessage('Conan executable not found.');
        this.conanVersion = '';
      }
    }
    return this.conanVersion !== '';
  }
}
