#!/bin/bash

# ============================================================================
# Supabase CLI Setup Script for Bagdja Marketplace
# ============================================================================

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║        BAGDJA MARKETPLACE - SUPABASE CLI SETUP               ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "📦 Installing Supabase CLI..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "Using Homebrew..."
            brew install supabase/tap/supabase
        else
            echo "Using npm..."
            npm install -g supabase
        fi
    else
        # Linux or other
        echo "Using npm..."
        npm install -g supabase
    fi
    
    echo "✅ Supabase CLI installed!"
else
    echo "✅ Supabase CLI already installed"
    supabase --version
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting Local Supabase..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Supabase
supabase start

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Applying Migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Apply migrations
supabase db push

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Local Supabase is ready!"
echo ""
echo "📍 Important URLs:"
echo "   • API:    http://localhost:54321"
echo "   • Studio: http://localhost:54323"
echo "   • DB:     postgresql://postgres:postgres@localhost:54322/postgres"
echo ""
echo "📝 Next Steps:"
echo "   1. Open Studio: open http://localhost:54323"
echo "   2. Verify tables created"
echo "   3. Start API: cd bagdja-api-services && npm run dev"
echo "   4. Start Store: cd bagdja-store-frontend && npm run dev"
echo "   5. Start Console: cd bagdja-console-frontend && npm run dev"
echo ""
echo "📚 Documentation:"
echo "   • Quick Start: MIGRATIONS-QUICKSTART.md"
echo "   • Full Guide:  MIGRATIONS.md"
echo ""
echo "🛑 To stop: supabase stop"
echo ""

