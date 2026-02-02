import * as vscode from 'vscode';

let pollingInterval: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Auto Disable Screen Reader extension is now active!');

    // Initialize logic
    updateBehavior();

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('autoDisableScreenReader') || e.affectsConfiguration('editor.accessibilitySupport')) {
                updateBehavior();
            }
        })
    );

    // Also listen to the accessibility support signal directly if possible
    // Note: vscode.env.onDidChangeAccessibilitySupport might be more direct for detection
    if ('onDidChangeAccessibilitySupport' in vscode.env) {
        context.subscriptions.push(
            (vscode.env as any).onDidChangeAccessibilitySupport(() => {
                checkAndDisable();
            })
        );
    }
}

function updateBehavior() {
    const config = vscode.workspace.getConfiguration('autoDisableScreenReader');
    const enabled = config.get<boolean>('enabled', true);
    const usePolling = config.get<boolean>('enablePolling', true);
    const interval = config.get<number>('pollingInterval', 500);

    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = undefined;
    }

    if (enabled) {
        checkAndDisable();
        if (usePolling) {
            pollingInterval = setInterval(checkAndDisable, interval);
        }
    }
}

async function checkAndDisable() {
    const config = vscode.workspace.getConfiguration('autoDisableScreenReader');
    if (!config.get<boolean>('enabled', true)) {
        return;
    }

    // vscode.env.accessibilitySupport is actually available in newer versions, 
    // but we can also rely on the configuration event and checking the effective state.
    const accessConfig = vscode.workspace.getConfiguration('editor');
    const currentVal = accessConfig.get<string>('accessibilitySupport');

    // We force it to 'off' if it's currently something else and auto-disable is enabled.
    if (currentVal !== 'off') {
        try {
            // Force it to off in Global (User) settings
            await accessConfig.update('accessibilitySupport', 'off', vscode.ConfigurationTarget.Global);
            console.log('Forcefully disabled Screen Reader Optimized mode.');
        } catch (err) {
            console.error('Failed to disable accessibility support:', err);
        }
    }
}

export function deactivate() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
}
