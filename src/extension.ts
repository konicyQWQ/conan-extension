import * as vscode from 'vscode';
import { addAutoCompletion } from './syntaxes/auto-completion';
import { StatusBar } from './helper/status';
import { registerCommand } from './helper/command';
import { Env } from './helper/env';

export function activate(context: vscode.ExtensionContext) {
    // conanfile.txt
    // - syntax highlight (./syntaxes/conanfile.tmLanguage.json)
    // - auto completion
    addAutoCompletion(context);

    // conan statusbar
    // - click to install 
    // - show loading icon when installing
    const statusBar = new StatusBar();
    context.subscriptions.push(statusBar.statusBarItem);

    // conan env
    // - workspace path
    // - conan version
    const env = new Env(context);

    // conan command
    // - conan install
    registerCommand(context, statusBar, env);
}

export function deactivate() { }
