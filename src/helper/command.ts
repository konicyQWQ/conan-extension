import * as vscode from 'vscode'
import { cp_exec } from '../utils';
import { StatusBar } from './status';
import { Env } from './env';

export const InstallCommandID = 'conan.install'

function registerInstallCommand(context: vscode.ExtensionContext, StatusBar: StatusBar, env: Env) {
    context.subscriptions.push(vscode.commands.registerCommand(InstallCommandID, async () => {
        if (env.workspacePath && !StatusBar.loading) {
            const outputChannel = vscode.window.createOutputChannel('conan install')
            outputChannel.show()
    
            try {
                StatusBar.setStatus({ loading: true });
                await cp_exec(`conan install . --output-folder=build --build=missing`, {
                    cwd: env.workspacePath,
                    channel: outputChannel,
                })
                vscode.window.showInformationMessage('Conan install success.')
            } catch (e) {
                vscode.window.showErrorMessage('Conan install failed. Please check output infomation.')
            } finally {
                StatusBar.setStatus({ loading: false })
            }
        }
    }))
}

export async function registerCommand(context: vscode.ExtensionContext, StatusBar: StatusBar, env: Env) {
    try {
        await env.checkConanEnv(context)
        registerInstallCommand(context, StatusBar, env)
    } catch {
        vscode.window.showErrorMessage('Conan executable not found.')
    }
}