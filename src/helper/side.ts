import * as vscode from 'vscode';
import { ConanGraphInfo, ConanfileDependency, Env } from './env';

type Item = {
  dependencies?: ConanfileDependency,
  info?: {
    label: string;
    description: string;
  }
};

export class ConanDependenciesProvider implements vscode.TreeDataProvider<Item> {
  env: Env;
  conanGraphInfo: ConanGraphInfo | undefined = undefined;

  constructor(env: Env) {
    this.env = env;
  }

  async getConanGraphInfo() {
    if (this.conanGraphInfo === undefined) {
      this.conanGraphInfo = await this.env.getConanGraphInfo();
    }
    return this.conanGraphInfo;
  }

  getTreeItem(element: Item): vscode.TreeItem {
    if (element.dependencies) {
      const [name, version] = element.dependencies.ref.split('/');
      return {
        iconPath: new vscode.ThemeIcon('package'),
        label: name,
        description: version,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      };
    } else {
      return {
        label: element.info?.label,
        description: element.info?.description,
        collapsibleState: vscode.TreeItemCollapsibleState.None
      };
    }
  }

  async getChildren(element?: Item | undefined): Promise<Item[]> {
    const conanInfo = await this.getConanGraphInfo();
    if (element) {
      const dependencyName = Object.keys(conanInfo).find(key => element.dependencies?.ref && key.search(element.dependencies.ref) !== -1);
      const dependency = conanInfo[dependencyName || ''];

      const ret: Item[] = [
        ...dependency.dependencies ? Object.values(dependency.dependencies).map(i => ({ dependencies: i })) : [],
        ...Object.entries(dependency.options || {}).filter(option => option[1] !== 'None').map(option => ({
          info: {
            label: option[0],
            description: String(option[1]),
          }
        }))
      ];

      return ret;
    } else {
      const { conanfile } = conanInfo;
      return Object.entries(conanfile?.dependencies || {}).map(([, i]) => ({ dependencies: i }));
    }
  }
}
