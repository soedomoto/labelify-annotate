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
