import * as vscode from 'vscode';

class ConanfileProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        return [
            {
                label: 'CMakeDeps',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'responsible for generating the CMake config files for all the required dependencies of a package.',
            },
            {
                label: 'CMakeToolchain',
                kind: vscode.CompletionItemKind.Keyword,
                detail: 'generates all the information needed for CMake to build the packages according to the information passed to Conan about things like the operating system, the compiler to use, architecture, etc. It will also generate cmake-presets files for easy integration with some IDEs that support this CMake feature off-the-shelf.'
            },
        ]
    }
}

export function addAutoCompletion(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerCompletionItemProvider(
        {
            language: 'conanfile',
            scheme: 'file',
        },
        new ConanfileProvider(),
    );
    context.subscriptions.push(disposable)
}

