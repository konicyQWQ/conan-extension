import * as vscode from 'vscode';
import { cp_exec } from '../utils';
import { StatusBar } from './status';
import { Env } from './env';
import { ConanDependenciesProvider } from './side';

export const installCommandID = 'conan.install';
export const refreshDependencies = 'conanDependencies.refreshEntry';

function produceInstallCommandString(path: string, env: Env) {
    const args = env.getConfig('installArgs');
    return `conan install ${path} ${args?.join(' ')}`;
}

function registerInstallCommand(context: vscode.ExtensionContext, statusBar: StatusBar, env: Env) {
    context.subscriptions.push(vscode.commands.registerCommand(installCommandID, async () => {
        if (env.workspacePath && !statusBar.loading) {
            const outputChannel = vscode.window.createOutputChannel('conan install');
            outputChannel.show();

            try {
                statusBar.setStatus({ loading: true });
                await cp_exec(produceInstallCommandString(env.workspacePath, env), {
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

function registerConanDependenciesCommand(context: vscode.ExtensionContext, dependencyDataProvider: ConanDependenciesProvider) {
    context.subscriptions.push(vscode.commands.registerCommand(refreshDependencies, async () => {
        vscode.window.showInformationMessage("refreshing...");
        await dependencyDataProvider.refresh();
        vscode.window.showInformationMessage("refresh conan dependencies OK!");
    }));
}

export async function registerCommand(context: vscode.ExtensionContext, statusBar: StatusBar, env: Env, dependencyDataProvider: ConanDependenciesProvider) {
    try {
        await env.getConanEnvMemo(context);
        registerInstallCommand(context, statusBar, env);
        registerConanDependenciesCommand(context, dependencyDataProvider);
    } catch { }
}