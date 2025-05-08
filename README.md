# Smart Home Control UI

A modern, responsive UI for controlling smart home devices built with React, Vite, and Tailwind CSS. This application provides a beautiful interface for managing IoT devices, with support for different screen sizes including mobile, tablet, desktop, and TV.

## Features

- **Responsive Design**: Works seamlessly on all devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Device Control**: Manage lights, climate control, security systems, and more
- **Room Management**: View and control devices by rooms
- **Quick Actions**: Easily toggle multiple devices with a single click
- **Mobile Compatibility**: Built with Capacitor for native mobile experiences

## Technologies Used

- **React**: Frontend UI library
- **Vite**: Next generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Capacitor**: For cross-platform native runtime
- **React Icons**: Icon library

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Building for Production

```
npm run build
```

## Mobile Deployment

This project is configured to work with Capacitor for mobile deployment:

1. Build the project:
   ```
   npm run build
   ```

2. Add platforms:
   ```
   npx cap add android
   npx cap add ios
   ```

3. Copy web assets:
   ```
   npx cap copy
   ```

4. Open native IDEs:
   ```
   npx cap open android
   npx cap open ios
   ```

## Customization

You can customize the UI by modifying the Tailwind CSS configuration in `tailwind.config.js` and the component styles in the individual React components.

## License

MIT