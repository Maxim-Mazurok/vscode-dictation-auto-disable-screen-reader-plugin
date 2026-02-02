# Publishing the VS Code Extension

To publish this extension to the VS Code Marketplace, follow these steps:

### 1. Install VSCE
First, install the Visual Studio Code Extension Manager (vsce) globally:

```bash
npm install -g @vscode/vsce
```

### 2. Create a Personal Access Token (PAT)
1. Go to [Azure DevOps](https://dev.azure.com/).
2. Create an organization if you don't have one.
3. In the organization settings, go to "Users" and ensure you have access.
4. Click on the "User settings" icon (top right) and select "Personal access tokens".
5. Create a new token with "Marketplace" -> "Manage" scope.

### 3. Create a Publisher
If you haven't already, create a publisher on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage).

### 4. Login via VSCE
Run the following command and provide your PAT:

```bash
vsce login <your-publisher-name>
```

### 5. Package the Extension
Run this command to create a `.vsix` file:

```bash
vsce package
```

### 6. Publish the Extension
Run this command to publish:

```bash
vsce publish
```

For more details, see the official [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) guide.
