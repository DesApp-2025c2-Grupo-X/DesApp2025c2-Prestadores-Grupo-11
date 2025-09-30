#!/bin/bash
set -e

echo "⚙️ Instalando alias global 'git sync' (fetch + crear ramas locales, modo seguro)..."

git config --global alias.sync '!f() { \
    git fetch --all && \
    for branch in $(git branch -r | grep -v "->"); do \
        local_branch=${branch#origin/}; \
        # Si la rama local no existe, la creamos y la hacemos track del remoto
        if ! git show-ref --verify --quiet refs/heads/"$local_branch"; then \
            git branch --track "$local_branch" "$branch" 2>/dev/null || true; \
        fi; \
    done; \
}; f'

echo "✅ Alias 'git sync' instalado."
echo "Usá: git sync   (trae refs remotas y crea ramas locales que todavía no existían)"
