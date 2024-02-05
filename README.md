# Climate DASH

ClimateDASH is a project developed by CodeGreen Labs, providing a user interface for climate-related data analysis and interactions with blockchain services.


This repository holds the source code for the ClimateDASH in the Climate Token Driver. Related programs are:
- [Climate Token Driver](https://github.com/Chia-Network/climate-token-driver)
- [CADT CodeGreen Version](https://github.com/CodeGreen-Labs/cadt) 
- [Chia Blockchain](https://github.com/Chia-Network/chia-blockchain)


# System Architecture

![alt system-architecture](/public/system-architecture.png "system-architecture")

# Structure

- `electron`:Contains the Electron start code.
- `src`:
  - `assets`: Includes fonts and images used in the project.
  - `components`:Houses React components.
  - `constants`: Contains constants specific to this project.
  - `pages`: Contains React pages.
  - `services`: Provides RTK Query services for API communication.
  - `store`:Holds the Redux store configuration.
  - `layout`:Provides the global user interface layout.
  - `types`: Includes TypeScript types used throughout the project.
  - `router`: Handles the routing for the pages.
  - `utils`: Contains utilities specific to this project.

# Usage

The ClimateDASH connects with the official [Chia Wallet](https://www.chia.net/downloads/) installed on localhost. The Climate Wallet also needs to connect to a [CADT CodeGreen Version](https://github.com/CodeGreen-Labs/cadt) node, which could be a publicly available observer node.


## Prerequisite

Before using this application, make sure you have the following prerequisites installed:

Node.js version 18.0.0 or higher.


### Generate GitHub Token for NPM Registry Authentication

1. **Copy `.npmrc.example` to `.npmrc`:**
   - In the root directory of your project, copy the `.npmrc.example` file and rename it to `.npmrc`.

2. **Go to GitHub:**
   - Open your web browser and navigate to [GitHub](https://github.com/).

3. **Log In:**
   - If you're not already logged in, sign in to your GitHub account.

4. **Access Personal Access Tokens:**
   - In the top-right corner, click on your profile picture, and then click on "Settings."

5. **Navigate to Developer settings:**
   - In the left sidebar, click on "Developer settings."

6. **Generate a New Token:**
   - On the Developer settings page, click on "Personal access tokens."

7. **Generate Token:**
   - Click on the "Generate token" button.

8. **Fill in Token Information:**
   - Enter a name for your token, and select the required scopes. For the use case you provided, you might need the "read:packages" scope.

9. **Generate Token:**
   - Scroll down and click the "Generate token" button.

10. **Copy Token:**
    - Once generated, GitHub will display the generated token. Copy this token and make sure to save it in a secure place. This token is only shown once.

11. **Update `.npmrc` File:**
    - Open your project's root directory and locate the `.npmrc` file.
    - Replace `<Your auth token>` with the token you generated. Your `.npmrc` file should look like this:

      ```plaintext
      //npm.pkg.github.com/:_authToken=YOUR_GENERATED_TOKEN

      @codegreen-labs:registry=https://npm.pkg.github.com
      shamefully-hoist=true
      ```

12. **Save Changes:**
    - Save the changes to the `.npmrc` file.

Now, your project is configured to use the GitHub token for authentication when accessing GitHub Packages. Make sure to keep this token secure and do not share it publicly.



### Installation and configuration

Follow these steps to install and configure the application:

- Clone the repository from GitHub.

```sh
git clone https://github.com/CodeGreen-Labs/climatedash.git
```

- Install the dependencies.

```sh
npm install
```

- Download the related service

```sh
npm run prepare
```

### Configurations

The application requires the following configurations:

- Copy  `.env.example` file to  `.env` file in the root directory of the project.
- Add the following configuration to the `.env` file like:

```
VITE_DATA_LAYER_END_POINT=<Replace with the data layer endpoint URL>
VITE_CLIMATE_TOKEN_DRIVER_URL=<Replace with the Climate Token Driver URL>
VITE_CLIMATE_EXPLORER_CHIA_URL=<Replace with the Climate Explorer Chia URL>
...
```
Please make sure to include the .env file in your project and provide the necessary configurations.

## Develop
Run the Vite development server.
```sh
npm run dev
```

## Packaging
To package the Electron app for distribution, you can use the following commands:
- Run the build command to build the project using TypeScript and Vite.

```sh
npm run build
```
This command packages the Electron app for the default platform.
- Package the Electron app for all platforms:
```sh
npm run package-all
```

These command packages the Electron app for Windows and macOS.
- Package the Electron app for Windows:
```sh
npm run package-win
```
- Package the Electron app for macOS:
```sh
npm run package-mac
```


## Interactions between Electron App and Backend Services via Blockchain


- `Frontend (this repo)`: The Electron application serves as the user interface,
  providing a seamless and interactive experience for users. It communicates
  with the backend services through HTTP protocols.
- `Backend Services`:
  - `CADT`: This service handles climate-related data and provides
    functionalities related to climate information and analysis.
- `Blockchain Integration`:
  - The backend services CADT interact with a shared blockchain component.
  - The blockchain serves as a decentralized and secure ledger that ensures data
    integrity, transparency, and reliability.
  - Chia RPC enable the backend services to communicate
    with and make transactions on the blockchain.


## Technologies Used

- React
- Electron
- Redux Toolkit
- Vite
- TypeScript

## Scripts

- dev: Run the Vite development server.
- build: Build the project using TypeScript and Vite.
- test: Run tests using Vitest.
- package: Package the Electron app.
- package-all: Package the Electron app for all platforms.
- package-mac: Package the Electron app for macOS.
- package-win: Package the Electron app for Windows.
- prerelease: Create a pre-release version and push tags.
- release: Create a patch release and push tags.
- eslint: Run ESLint for code linting.
- prepare: Run Vite Node to prepare the project.

## Contributing

[Signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) are required.

This repo uses a commit convention. A typical commit message might read:

```
    fix: correct home screen layout
```

The first part of this is the commit "type". The most common types are "feat" for new features, and "fix" for bugfixes. Using these commit types helps us correctly manage our version numbers and changelogs. Since our release process calculates new version numbers from our commits it is very important to get this right.

- `feat` is for introducing a new feature
- `fix` is for bug fixes
- `docs` for documentation only changes
- `style` is for code formatting only
- `refactor` is for changes to code which should not be detectable by users or testers
- `perf` is for a code change that improves performance
- `test` is for changes which only touch test files or related tooling
- `build` is for changes which only touch our develop/release tools
- `ci` is for changes to the continuous integration files and scripts
- `chore` is for changes that don't modify code, like a version bump
- `revert` is for reverting a previous commit


