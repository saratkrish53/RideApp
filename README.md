# Uber-like Expo MVP App

A simple MVP implementation of an Uber-like application built with React Native and Expo. This app focuses only on the rider's perspective and does not include authentication.

![Uber Clone Cover](./assets/RideApp_Cover_Template_Aligned.png)

## Features

- Location-based interface using maps
- Destination selection
- Driver matching simulation
- Ride status tracking
- Ride rating system
- Simple fare calculation

## Prerequisites

Before you can run this application, you need to have the following installed:

1. **Node.js** - Download and install from [nodejs.org](https://nodejs.org/)
2. **Expo CLI** - After installing Node.js, install Expo CLI by running:
   ```
   npm install -g expo-cli
   ```
3. **Expo Go App** - Download on your iOS or Android device from the App Store or Google Play Store

## Installation

1. Clone or download this repository
2. Navigate to the project directory in your terminal
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Scan the QR code with your Expo Go app to open the application on your device

## Usage

The app simulates a basic Uber-like experience:

1. Set your destination
2. Get matched with a simulated driver
3. View the ride progress
4. Rate the driver and add a tip (optional)

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Maps
- Expo Location API

## Note

This is a simplified MVP version with no backend integration. All driver data and ride details are simulated locally.

## License

MIT
