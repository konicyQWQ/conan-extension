import path = require('path');
import * as vscode from 'vscode';
import { cp_exec } from '../utils';

export class Env {
    workspacePath: string | null = null;
    conanfilePath: string | null = null;
    conanVersion: string | null = null;

    constructor(context: vscode.ExtensionContext) {
        if (vscode.workspace.workspaceFolders) {
            this.workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            this.conanfilePath = path.resolve(this.workspacePath, 'conanfile.txt');
        }
    }

    async getConanEnv(context: vscode.ExtensionContext): Promise<boolean> {
        if (this.conanVersion === null) {
            try {
                const stdout = await cp_exec('conan --version');
                this.conanVersion = stdout;
            } catch {
                this.conanVersion = '';
            }
        }
        return this.conanVersion !== '';
    }
}