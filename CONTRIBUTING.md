# Contributing to Macro Browser Documentation

We welcome contributions to the Macro Browser documentation! This guide will help you understand how to make changes to our GitBook documentation.

## Getting Started

1. Fork the repository to your GitHub account
2. Clone your fork to your local machine
3. Make sure you have Git and a text editor installed

## Documentation Structure

Our documentation follows the standard GitBook structure:

- `README.md`: Main landing page
- `SUMMARY.md`: Navigation structure for the documentation
- `/getting-started/`: Introduction and setup guides
- `/features/`: Detailed feature documentation
- `/technical/`: Technical architecture and implementation details
- `/roadmap/`: Development roadmap information
- `/assets/`: Images and other media files

## Making Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b your-branch-name
   ```

2. Make your changes using your preferred text editor
   - Follow the existing style and formatting
   - Use Markdown for formatting
   - Place images in the `/assets/images/` directory

3. Preview your changes locally:
   - If you have the GitBook CLI installed:
     ```bash
     gitbook serve
     ```
   - Or use any Markdown previewer

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

5. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```

6. Create a Pull Request from your fork to the main repository

## Style Guidelines

### Markdown

- Use `#` for main titles, `##` for section titles, and so on
- Use bullet lists (`-`) for unordered lists
- Use numbered lists (`1.`) for sequential steps
- Use backticks (`` ` ``) for inline code and triple backticks (`` ``` ``) for code blocks

### Images

- Add descriptive alt text to all images
- Keep image files reasonably sized (compress if necessary)
- Use descriptive filenames for images
- Reference images using relative paths

### Content

- Be clear and concise
- Focus on helping users understand features or solve problems
- Include examples where appropriate
- Avoid jargon without explanation
- Keep technical details accurate and up-to-date

## Adding New Pages

1. Create the new Markdown file in the appropriate directory
2. Add a link to your new page in the `SUMMARY.md` file
3. Ensure your page has a clear title and structure

## Questions or Issues

If you have any questions about contributing, please:

- Open an issue in the repository
- Contact the documentation team at docs@macrobrowser.com

Thank you for helping improve the Macro Browser documentation! 