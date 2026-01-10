# GitHub Portfolio Generator

A modern, responsive web application that automatically generates a stunning personal portfolio website from your GitHub profile.

## Features

### Core Features
- **GitHub Data Fetching**: Automatically fetch profile data from GitHub API
- **No Backend Required**: Uses GitHub REST API directly from the browser
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Multiple Templates**: Choose from Minimal, Dark, Colorful, or Tech themes

### Data Displayed
- **Profile Information**
  - Name
  - Avatar
  - Bio
  - Location
  - GitHub profile link

- **Statistics**
  - Public repositories count
  - Followers
  - Following

- **Repositories**
  - Top 10 repositories (sorted by stars)
  - Repository name, description, language, and star count
  - Direct links to each repository

- **Skills**
  - Auto-generated from repository languages
  - Visual skill tags with color coding

### Customization
- **Theme Switching**: Switch between 4 different themes in real-time
- **Section Toggle**: Show/hide portfolio sections as needed
- **Responsive Layout**: Automatically adapts to any screen size

### Export & Sharing
- **One-Click Export**: Download your portfolio as a standalone HTML file
- **Shareable Link**: Generate a URL to share your portfolio
- **Copy to Clipboard**: Easily copy and share your portfolio link

## How to Use

1. **Open the Application**
   - Open `index.html` in your web browser

2. **Enter Your GitHub Username**
   - Type your GitHub username in the input field
   - Click "Generate Portfolio" or press Enter

3. **Customize Your Portfolio**
   - Use the customization panel to:
     - Switch themes (Minimal, Dark, Colorful, Tech)
     - Toggle sections on/off
   - Click back to change templates before generating

4. **Export or Share**
   - Click "Export" to download as HTML file
   - Click "Share" to get a shareable link

5. **Shareable Links**
   - Share the generated link: `yoursite.com?username=github_username&theme=dark`
   - Portfolio auto-loads when you paste the link

## Themes

### Minimal
Clean, professional design with a light color scheme. Perfect for traditional portfolios.

### Dark
Dark background with light text. Easy on the eyes and modern look.

### Colorful
Vibrant gradient backgrounds with multiple colors. Eye-catching and creative.

### Tech
Neon cyan and magenta with a tech-inspired aesthetic. Perfect for tech professionals.

## File Structure

```
├── index.html       # Main HTML structure
├── styles.css       # All styling and themes
├── script.js        # JavaScript functionality
└── README.md        # This file
```

## Technical Details

### Technologies Used
- HTML5
- CSS3 (with animations and gradients)
- Vanilla JavaScript (ES6+)
- GitHub REST API v3

### API Endpoints Used
- `GET /users/{username}` - User profile information
- `GET /users/{username}/repos` - User repositories

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Features in Detail

### Responsive Design
- Mobile-optimized layout
- Flexible grid system
- Touch-friendly buttons and inputs
- Optimized for screens from 320px to 4K+

### Animations
- Smooth page transitions
- Hover effects on interactive elements
- Loading spinner for API calls
- Animated skill tags and project cards

### Error Handling
- User-friendly error messages
- Validation for empty inputs
- Graceful API error handling
- Network error detection

### Performance
- Minimal dependencies (vanilla JS)
- Fast loading times
- Efficient DOM manipulation
- Optimized CSS with minimal repaints

## Keyboard Shortcuts
- **Enter** in username input: Generate portfolio
- **Escape** in share modal: Close modal

## Browser Storage
The application uses URL parameters to share portfolios, making them cacheable and shareable without needing a database.

## Limitations
- GitHub API has rate limits (60 requests/hour for unauthenticated requests)
- Public repositories only
- No real-time updates (generate new portfolio to see latest changes)

## Future Enhancements
- GitHub authentication for higher rate limits
- Custom domain support
- SSL certificate for HTTPS sharing
- Database for saving portfolio preferences
- Social media links integration
- Live preview while editing
- PDF export option
- AI-powered descriptions for projects
- Custom colors and fonts

## License
MIT License - Feel free to use and modify for your own purposes.

## Support
If you encounter any issues:
1. Check that your GitHub username is correct
2. Ensure your profile is public
3. Try a different theme
4. Check browser console for error messages

## Contributing
Feel free to fork this project and submit improvements!

---

Made with ❤️ for developers
