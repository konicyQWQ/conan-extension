import path = require('path');
import * as vscode from 'vscode';
import { cp_exec } from '../utils';

type ConanExtensionConfig = {
    installArgs: Array<string>;
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