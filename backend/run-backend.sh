#!/bin/bash
# Run this script from the backend directory

JAR=$(ls lib/postgresql-*.jar 2>/dev/null | head -n 1)
if [ -z "$JAR" ]; then
  echo "PostgreSQL JDBC driver not found in lib/. Please download and place it there."
  exit 1
fi


# Clean previous compiled files
rm -rf out




# Compile all Java files robustly using find to ensure all files are included
javac -cp "$JAR" -d out $(find src -name "*.java")
if [ $? -ne 0 ]; then
  echo "Compilation failed."
  exit 1
fi

# Run the backend
java -cp "out:$JAR" Main
