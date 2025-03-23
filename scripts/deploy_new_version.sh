#!/bin/bash

# Path to package.json
PACKAGE_JSON="package.json"

# Check if package.json exists
if [[ ! -f "$PACKAGE_JSON" ]]; then
    echo "Error: $PACKAGE_JSON not found!"
    exit 1
fi

# Extract the current version from package.json
CURRENT_VERSION=$(grep -oP '"version":\s*"\K[0-9]+\.[0-9]+\.[0-9]+' "$PACKAGE_JSON")

if [[ -z "$CURRENT_VERSION" ]]; then
    echo "Error: Could not find version in $PACKAGE_JSON!"
    exit 1
fi

echo "Current version: $CURRENT_VERSION"

# Increment the patch version (last number in x.x.x)
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"

# Update the version in package.json
sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE_JSON"

echo "Updated version: $NEW_VERSION"

echo "pushing the new version to git"
git add $PACKAGE_JSON
git commit -m "Script: update version to $NEW_VERSION"
# add the new version to the tag
git tag -a $NEW_VERSION -m "version $NEW_VERSION"
git push origin $NEW_VERSION