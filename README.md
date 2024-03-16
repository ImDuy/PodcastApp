This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Podcast Application

## Install required Packages

First, you will need to install all required packages in package.json files for both backend and frontend.

Run the following command from both **_frontend_** folder and **_server_** folder:

```bash
# using npm
npm install
```

If you are using iOS simulator to run the application, you will need to install the pods (via [Cocoapods](https://cocoapods.org/)).

Run the following command from **_frontend_** folder:

```bash
npx pod-install ios
```

> **Note**: Make sure you are using **Cocoapods >= v1.15.2** to avoid any unexpected error for installing pods.

## Start the Application

First, you will need to run the backend server.

From the **_server_** folder, run the following command:

```bash
npm run dev
```

After the database is connected, open a _new_ terminal from the **_frontend_** folder and run the following command to start the application:

### For Android

```bash
npx react-native run-android
```

### For iOS

```bash
npx react-native run-ios
```

If everything is set up _correctly_, you should see the application running in your _Android Emulator_ or _iOS Simulator_ shortly.

Use the following account to login and test the application:

> **Email**: test@email.com

> **Password**: @$12Test
