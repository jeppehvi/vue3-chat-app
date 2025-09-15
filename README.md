## Vue 3 Chat App Experience

[![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/socket.io-4-black.svg)](https://socket.io/)

A modern real-time chat application built with Vue 3, TypeScript, Vite, Tailwind CSS, and Socket.io. Features include live messaging, emoji support, online user tracking, typing indicators, and a clean, responsive UI.

## 🔗 Live Demo

**[Try the Vue 3 Chat App →](#)**

![Chat App Preview](./public/vite.svg)

## 🌟 Features

- **Real-Time Messaging**: Instant chat powered by Socket.io
- **Emoji Support**: Insert emojis via picker or shortcodes (e.g. :smirk:)
- **Online Users Sidebar**: See who's online and who's typing
- **Typing Indicators**: Live feedback when users are composing messages
- **Join/Leave Notifications**: System messages for user activity
- **Responsive Design**: Works on desktop and mobile
- **Modern Tech Stack**: Vue 3, Vite, Tailwind CSS, TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jeppehvi/vue3-chat-app.git

# Navigate to the project directory
cd vue3-chat-app

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` in your browser to see the application running.

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Real-Time Backend**: Express + Socket.io
- **Emoji Picker**: vue3-emoji-picker
- **State Management**: Vue Composition API

## 📁 Project Structure

```
vue3-chat-app/
├── public/                # Static assets
├── frontend/
│   ├── src/
│   │   ├── assets/        # App images/icons
│   │   ├── components/    # Vue components
│   │   ├── services/      # API/socket services
│   │   ├── types/         # TypeScript types
│   │   ├── App.vue        # Main app component
│   │   ├── main.ts        # App entry point
│   │   └── style.css      # Global styles
│   ├── index.html         # App HTML
│   ├── package.json       # Frontend dependencies
│   └── ...                # Config files
├── backend/
│   ├── server.js          # Express + Socket.io server
│   ├── package.json       # Backend dependencies
│   └── ...                # Config files
└── ...                    # Root config files
```

## 🎮 Usage

1. **Send Messages**: Type and send messages in real time
2. **Emoji Picker**: Click the emoji button to insert emojis
3. **Shortcodes**: Type :smirk: or other shortcodes for emojis
4. **Online Users**: View and interact with users in the sidebar
5. **Typing Indicator**: See when others are typing

## 📝 Customization

- **Add Features**: Extend components in `src/components/`
- **Styling**: Customize Tailwind config and `style.css`
- **Backend Logic**: Update `backend/server.js` for new events
- **Emoji Support**: Add more emoji shortcodes or picker options

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

Jeppe - [@jeppehvi](https://github.com/jeppehvi)

Project Link: [https://github.com/jeppehvi/vue3-chat-app](https://github.com/jeppehvi/vue3-chat-app)

---

<p align="center">
	Made with 💬 and modern web tech
</p>