import * as vscode from 'vscode';
import { installCommandID } from './command';

export class StatusBar {
    statusBarItem: vscode.StatusBarItem;
    loading: boolean = false;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
        this.statusBarItem.command = installCommandID;
        this.setStatus({ loading: false });
        this.statusBarItem.show();
    }

    setStatus({ loading }: { loading: boolean }) {
        this.loading = loading;

        const icon = loading ? '$(loading~spin)' : '$(package)';
        this.statusBarItem.text = `${icon} Conan Install`;
    }
}