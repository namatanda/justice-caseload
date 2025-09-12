#!/bin/bash

# Production build script with error handling
set -e

echo "Starting Next.js production build..."

# Set environment variables for build
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export SKIP_DEBUG_ROUTES=true

# Create a Node.js polyfill for File API if it doesn't exist
cat > file-polyfill.js << 'EOF'
// Polyfill for File API in Node.js build environment
if (typeof global !== 'undefined' && !global.File) {
  global.File = class File {
    constructor(bits, name, options = {}) {
      this.name = name;
      this.size = bits.reduce((size, bit) => size + (bit.length || bit.byteLength || 0), 0);
      this.type = options.type || '';
      this.lastModified = options.lastModified || Date.now();
    }
    
    arrayBuffer() {
      return Promise.resolve(new ArrayBuffer(0));
    }
    
    text() {
      return Promise.resolve('');
    }
  };
}
EOF

# Load the polyfill before build
node -r ./file-polyfill.js -e "console.log('File polyfill loaded')"

# Try building with standard build first
if node -r ./file-polyfill.js ./node_modules/.bin/next build; then
    echo "✅ Build completed successfully"
    rm -f file-polyfill.js
    exit 0
else
    echo "❌ Standard build failed, trying alternative approach..."
    
    # If build fails, try with additional flags
    export DISABLE_STATIC_OPTIMIZATION=1
    
    if node -r ./file-polyfill.js ./node_modules/.bin/next build; then
        echo "✅ Build completed with alternative configuration"
        rm -f file-polyfill.js
        exit 0
    else
        echo "❌ Build failed completely"
        rm -f file-polyfill.js
        exit 1
    fi
fi
