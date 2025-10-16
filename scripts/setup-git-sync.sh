#!/bin/bash
set -e

echo "⚙️ Instalando alias global 'git sync' (fetch + crear ramas locales, modo seguro)..."

git config --global alias.sync '!f() { \
    git fetch --all && \
    for branch in $(git branch -r | awk "!/HEAD/ {print}"); do \
        local_branch=${branch#origin/}; \
        if ! git show-ref --verify --quiet refs/heads/"$local_branch"; then \
            git branch --track "$local_branch" "$branch" 2>/dev/null || true; \
        fi; \
    done; \
}; f'


echo "✅ Alias 'git sync' instalado."
echo "Usá: git sync   (trae refs remotas y crea ramas locales que todavía no existían)"
