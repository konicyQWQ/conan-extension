import * as vscode from 'vscode';
import { addAutoCompletion } from './syntaxes/auto-completion';
import { StatusBar } from './helper/status';
import { registerCommand } from './helper/command';
import { Env } from './helper/env';
import { ConanDependenciesProvider } from './helper/side';

export function activate(context: vscode.ExtensionContext) {
    // conan env
    // - workspace path
    // - conan version
    // - extension config
    // - conan graph info (dependency and build options)
    const env = new Env(context);

    // conanfile.txt
    // - syntax highlight (./syntaxes/conanfile.tmLanguage.json)
    // - auto completion
    addAutoCompletion(context);

    // conan statusbar
    // - click to install 
    // - show loading icon when installing
    const statusBar = new StatusBar();
    context.subscriptions.push(statusBar.statusBarItem);

    // conan sidebar
    // - show dependency
    vscode.window.createTreeView('conanDependencies', {
        treeDataProvider: new ConanDependenciesProvider(env)
    });

    // conan command
    // - conan install
    registerCommand(context, statusBar, env);
}

export function deactivate() { }
