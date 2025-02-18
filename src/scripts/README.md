## Scripts

This directory contains scripts to manage environment and connection in the embeddable workspace.

### Requirements

- 1Password CLI
- Node.js

### Secrets Management

Environment variables are stored in 1Password. If you don't have a 1Password account, please contact the DevOps team for access credentials.

We use a `.env.tpl` template file that references secrets stored in 1Password. To set up your environment:

1. Run the following command:
```bash
make all
```
2. The 1Password CLI will prompt you to authenticate
3. After authentication, it will automatically create a `.env` file with the required secrets

To update existing secrets or add new ones:
1. Modify the `.env.tpl` file
2. Run `make all` again
3. 1Password CLI will prompt you to overwrite the existing `.env` file



### Environment Management

The following commands are available for managing environments:

- `make environment-list`: Lists all environments and their configurations
- `make environment-read`: Tests all environments and their configurations
- `make environment-create`: Creates new environments based on predefined configurations
- `make environment-update`: Updates existing environments with new configurations

### Connection Management

The following commands are available for managing connections:

- `make connection-create`: Creates new connections based on predefined configurations
- `make connection-list`: Lists all configured connections
- `make connection-read`: Tests all configured connections
- `make connection-update`: Updates existing connection configurations



