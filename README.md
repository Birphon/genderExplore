# Gender Expression Traits Explorer

An interactive web tool for exploring and understanding different aspects of gender expression. This project provides a visual interface for examining various traits traditionally associated with different gender expressions.

## Features

### Core Functionality
- Interactive trait selection system
- Real-time progress tracking
- Comprehensive gender expression analysis
- Mobile-responsive design
- Dark mode interface

### Selection System
- Four selection options for each trait:
  - Masculine (Blue)
  - Feminine (Pink)
  - Both (Grey)
  - Either (White)

### Analysis Features
- Dynamic progress bar showing selection distribution
- Detailed percentage breakdown of selections
- Gender expression analysis with primary and secondary expressions
- Category filtering system

### Responsive Design
- Adapts to different screen sizes
- Optimized mobile view with hidden category columns
- Sticky headers for better navigation
- Accessible on all devices

## Technical Details

### File Structure
```
├── index.html
├── styles.css
├── script.js
├── data.json
└── README.md
```

### Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- JSON for data storage

### Debug Tools
The application includes debug functions accessible through the browser console:
```javascript
male100()   // Sets all selections to masculine
fem100()    // Sets all selections to feminine
random()    // Randomizes all selections
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Configure GitHub Pages:
   - Go to repository settings
   - Navigate to "Pages" section
   - Select your main branch as source
   - Save to enable GitHub Pages

3. The site will be available at:
   ```
   https://[username].github.io/[repository-name]/
   ```

## Data Structure

The application uses a JSON data structure with the following format:
```json
{
  "categories": [
    {
      "name": "Category Name",
      "subcategories": [
        {
          "name": "Subcategory Name",
          "traits": [
            {
              "masculine": "Masculine trait description",
              "feminine": "Feminine trait description"
            }
          ]
        }
      ]
    }
  ]
}
```

## Important Notice

This tool is for exploratory and educational purposes only. It is not:
- A diagnostic tool
- Scientifically validated
- Medically accurate
- A substitute for professional advice

If you are questioning your gender identity, please:
- Consult with healthcare professionals
- Seek support from licensed gender therapists
- Access official resources and documentation
- Remember that your journey is personal and valid

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors and researchers in gender studies
- Special thanks to the LGBTQ+ community for their insights and feedback
- Appreciation to all users who help improve this tool

## Contact

For questions, issues, or suggestions:
- Submit an issue through GitHub
- Fork the repository and submit a pull request
- Contact the maintainers directly through GitHub

---

**Note:** This project is continuously evolving. Check back for updates and new features.