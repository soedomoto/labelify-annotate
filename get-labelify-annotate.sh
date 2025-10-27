#!/bin/bash
set -e

# Directory name
DIR="labelify-annotate"

# Ensure the directory exists and is empty
if [ -d "$DIR" ]; then
    echo "Directory '$DIR' exists. Emptying it..."
    rm -rf "$DIR"/*
else
    echo "Creating directory '$DIR'..."
    mkdir -p "$DIR"
fi

# Get tarball URL for the latest version from npm
TARBALL_URL=$(npm view @labelify/annotate dist.tarball)

# Check if URL was retrieved successfully
if [ -z "$TARBALL_URL" ]; then
    echo "Failed to retrieve tarball URL for @labelify/annotate."
    exit 1
fi

# Download the tarball
echo "Downloading tarball from $TARBALL_URL..."
curl -L "$TARBALL_URL" -o labelify-annotate.tgz

# Extract the tarball into the directory
echo "Extracting tarball into '$DIR'..."
tar -xzf labelify-annotate.tgz -C "$DIR" --strip-components=1

# Clean up
rm labelify-annotate.tgz

echo "Done. Extracted @labelify/annotate into '$DIR'."

# Remove all content of ./venv/lib/python3.12/site-packages/web/dist/apps/labelstudio/*
echo "Removing all content of ./venv/lib/python3.12/site-packages/web/dist/apps/labelstudio/*..."
rm -rf ./venv/lib/python3.12/site-packages/web/dist/apps/labelstudio/*

# Copy all content of ./labelify-annotate/dist/assets to ./venv/lib/python3.12/site-packages/web/dist/apps/labelstudio
echo "Copying all content of ./labelify-annotate/dist/assets to ./venv/lib/python3.12/site-packages/web/dist/apps/labelstudio..."
cp -r ./labelify-annotate/dist/assets/* ./venv/lib/python3.12/site-packages/web/dist/apps/labelstudio/

# Execute the node command to update base.html
echo "Updating base.html using node..."
node ./labelify-annotate/dist/update_base_html.cjs ./labelify-annotate/dist/index.html ./venv/lib/python3.12/site-packages/label_studio/templates/base.html
