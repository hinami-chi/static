# 🎵 Hinami's osu! Overlay

A minimalist custom overlay for osu! compatible with gosumemory and tosumemory.

## 📋 Description

This is a static frontend overlay designed to display real-time information during osu! gameplay. The overlay integrates seamlessly with memory tools like gosumemory or tosumemory, providing a clean and modern interface for streamers and players.

## 🎨 Overlay Features

Designed by [hinami-chi](https://github.com/hinami-chi), this overlay offers:

- 🖥️ Optimized for 4:3 resolutions
- 🎯 Clean and modern interface
- 📊 Real-time score, combo and HP visualization
- 🏆 Visual ranking system
- 🎵 Current song information
- ⚙️ Configurable states (interface enabled/disabled)

**Preview:**

| Interface Disabled | Interface Enabled |
|-------------------|-------------------|
| <img src="hinami/img/interface%20disabled.png" width="400"> | <img src="hinami/img/interface%20enabled.png" width="400"> |

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hinami-chi/static.git
   cd static
   ```

2. **Setup your memory tool:**
   - For **gosumemory**: Place the `hinami` folder in the `static` directory
   - For **tosumemory**: Configure the path to the `hinami` overlay folder

3. **Configure the overlay:**
   - Edit `hinami/config.json` to customize settings
   - Adjust the API key if necessary

## 🎯 Compatibility

- ✅ **Resolutions:** Optimized for 4:3 (1024x768, 1280x960, 1600x1200)
- ✅ **Tools:** gosumemory, tosumemory
- ✅ **Browsers:** Chrome, Firefox, Edge
- ⚠️ **16:9:** Functional but not optimized

## 📁 Project Structure

```
hinami/
├── index.html          # Main overlay file
├── index.css           # Overlay styles  
├── index.js            # Logic and WebSocket
├── config.json         # Configuration
├── deps/               # JavaScript dependencies
│   ├── countUp.js
│   ├── reconnecting-websocket.min.js
│   └── smooth.js
├── img/                # Screenshots
├── resources/          # Custom fonts
└── skin/               # Visual elements (rankings, numbers, etc.)
```

## 🔧 Customization

### Modify Styles
Edit `hinami/index.css` to change:
- Theme colors
- Element positioning  
- Font sizes
- Transparencies

### Change Fonts
Fonts are located in `hinami/resources/`:
- `Cabin-Bold.ttf` - Main text
- `Digital-Serial Regular.ttf` - Score numbers
- `Roboto-Bold.ttf` - Secondary text

### Graphic Elements
Visual elements are in `hinami/skin/`:
- Rankings (S, A, B, C, D, X, SH, XH)
- Score digits (0-9)
- Progress bars
- Mod icons

## 🤝 Contributing

Contributions are welcome! If you have ideas to improve the overlay:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 👤 Author

**hinami-chi**
- GitHub: [@hinami-chi](https://github.com/hinami-chi) / [@ryuuseinan](https://github.com/ryuuseinan) 

## 🙏 Acknowledgments

- osu! community for feedback and suggestions
- gosumemory and tosumemory developers
- Creators of the libraries used

---

⭐ If you like this project, don't forget to give it a star!
