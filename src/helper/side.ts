import * as vscode from 'vscode';
import { ConanfileDependency, Env } from './env';

export class ConanDependenciesProvider implements vscode.TreeDataProvider<ConanfileDependency> {
    env: Env;

    constructor(env: Env) {
        this.env = env;
    }

    getTreeItem(element: ConanfileDependency): vscode.TreeItem {
        const [name, version] = element.ref.split('/');
        return {
            label: name,
            description: version,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
        };
    }

    async getChildren(element?: ConanfileDependency | undefined): Promise<ConanfileDependency[]> {
        if (element) {
            // TODO: show more infomation
            return [];
        } else {
            const { conanfile } = await this.env.getConanGraphInfo();
            return Object.entries(conanfile?.dependencies || {}).map(([, i]) => i);
        }
    }
}