const fs = require('fs');
const path = require('path');

// Get arguments for paths
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node update_base_html.cjs <path-to-index-html> <path-to-base-html>');
  process.exit(1);
}

let [indexPath, basePath] = args;

// Convert to absolute paths if relative
if (!path.isAbsolute(indexPath)) {
  indexPath = path.resolve(process.cwd(), indexPath);
}
if (!path.isAbsolute(basePath)) {
  basePath = path.resolve(process.cwd(), basePath);
}

// Read the content of the index.html file
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Extract script .js base names
  const scriptMatches = [...data.matchAll(/<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/g)];
  const scriptBaseNames = scriptMatches.map(match => path.basename(match[1]));

  // Extract link rel="stylesheet" .css base names
  const linkMatches = [...data.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g)];
  const linkBaseNames = linkMatches.map(match => path.basename(match[1]));

  console.log('Script .js base names:', scriptBaseNames);
  console.log('Link rel="stylesheet" .css base names:', linkBaseNames);

  // Read the content of the base.html file
  fs.readFile(basePath, 'utf8', (err, baseData) => {
    if (err) {
      console.error('Error reading base.html:', err);
      return;
    }

    // Replace script src base names inside block app-js
    const updatedBaseData = baseData
      .replace(
        /{% block app-js %}([\s\S]*?){% endblock %}/,
        `{% block app-js %}\n<script type="module" crossorigin src="{{settings.FRONTEND_HOSTNAME}}/react-app/${scriptBaseNames[0]}?v={{ versions.backend.commit }}"></script>\n{% endblock %}`
      )
      .replace(
        /{% block app-css %}([\s\S]*?){% endblock %}/,
        `{% block app-css %}\n<link href="{{settings.FRONTEND_HOSTNAME}}/react-app/${linkBaseNames[0]}?v={{ versions.backend.commit }}" rel="stylesheet">\n{% endblock %}`
      );

    // Write the updated content back to base.html
    fs.writeFile(basePath, updatedBaseData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to base.html:', err);
        return;
      }
      console.log('Updated base.html successfully.');
    });
  });
});