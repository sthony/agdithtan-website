#!/bin/bash

# Create project structure for Agdith Company Profile
mkdir -p agdith-website
cd agdith-website

# Create directory structure
mkdir -p backend/{routes,controllers,models,middleware,config,uploads,uploads/images,uploads/documents}
mkdir -p frontend/{src/{components,pages,assets,styles,api}}
mkdir -p backend/database

# Backend files will be created separately
echo "Folder structure created successfully!"
