import * as cp from 'child_process'
import * as vscode from 'vscode'

type ExecOptions = cp.ExecOptions & {
    channel?: vscode.OutputChannel
}

export async function cp_exec(command: string, options?: ExecOptions): Promise<string> {
    if (options?.cwd) {
        options?.channel?.appendLine(`Cwd: ${options.cwd}`)
    }
    options?.channel?.appendLine(`> ${command}`)

    const process = cp.exec(command, options)
    let stdout = ''
    let stderr = ''

    process.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString()
        options?.channel?.append(data.toString())
    })
    process.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString()
        options?.channel?.append(data.toString())
    })

    return new Promise((resolve, reject) => {
        process.on('close', (code) => {
            if (code) {
                reject(stderr)
            }
            resolve(stdout)
        })
    })
}