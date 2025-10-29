#!/bin/bash
set -e

rm -rf ../.venv/lib/python3.13/site-packages/web/dist/apps/labelstudio/*
cp -r ./dist/assets/* ../.venv/lib/python3.13/site-packages/web/dist/apps/labelstudio/
node ./update_base_html.cjs ./dist/index.html ../.venv/lib/python3.13/site-packages/label_studio/templates/base.html