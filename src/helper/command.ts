import * as vscode from 'vscode';
import { cp_exec } from '../utils';
import { StatusBar } from './status';
import { Env } from './env';

export const installCommandID = 'conan.install';

function registerInstallCommand(context: vscode.ExtensionContext, statusBar: StatusBar, env: Env) {
    context.subscriptions.push(vscode.commands.registerCommand(installCommandID, async () => {
        if (env.workspacePath && !statusBar.loading) {
            const outputChannel = vscode.window.createOutputChannel('conan install');
            outputChannel.show();
    
            try {
                statusBar.setStatus({ loading: true });
                await cp_exec(`conan install . --output-folder=build --build=missing`, {
                    cwd: env.workspacePath,
                    channel: outputChannel,
                });
                vscode.window.showInformationMessage('Conan install success.');
            } catch (e) {
                vscode.window.showErrorMessage('Conan install failed. Please check output infomation.');
            } finally {
                statusBar.setStatus({ loading: false });
            }
        }
    }));
}

export async function registerCommand(context: vscode.ExtensionContext, statusBar: StatusBar, env: Env) {
    try {
        await env.getConanEnv(context);
        registerInstallCommand(context, statusBar, env);
    } catch {
        vscode.window.showErrorMessage('Conan executable not found.');
    }
}