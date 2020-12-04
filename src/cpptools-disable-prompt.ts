import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  if (vscode.extensions.getExtension('ms-vscode.cpptools')) {
    let intellisenseEngine =
        vscode.workspace.getConfiguration('C_Cpp').get<string>(
            'intelliSenseEngine');

    if (intellisenseEngine != 'Disabled') {
      let dontAsk =
          context.globalState.get<boolean>('dontAskCpptoolsDisablePrompt');

      let message =
          'Microsoft C/C++ Extension has been detected, which provides part of clangd functionalities (IntelliSense). Do you want to disable the conflicting features (the window will be reloaded)?';

      if (!dontAsk) {
        let promptResult;

        if (vscode.workspace.workspaceFolders?.length) {
          promptResult = await vscode.window.showInformationMessage(
              message, 'Yes', 'For this workspace', 'No, never ask me again');
        } else {
          promptResult = await vscode.window.showInformationMessage(
              message, 'Yes', 'No, never ask me again');
        }

        switch (promptResult) {
        case 'Yes':
          vscode.workspace.getConfiguration('C_Cpp').update(
              'intelliSenseEngine', 'Disabled', true);
          context.globalState.update('dontAskCpptoolsDisablePrompt', true);
          vscode.commands.executeCommand('workbench.action.reloadWindow');
          break;
        case 'For this workspace':
          // Only in this case we do not disable the prompt,
          // because the user might want to decide later
          vscode.workspace.getConfiguration('C_Cpp').update(
              'intelliSenseEngine', 'Disabled', false);
          vscode.commands.executeCommand('workbench.action.reloadWindow');
          break;
        case 'No, never ask me again':
          context.globalState.update('dontAskCpptoolsDisablePrompt', true);
          break;
        }
      }
    }
  }
}
