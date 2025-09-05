.PHONY: dev build deploy

# 開発用サーバー
dev:
	npm run dev

# ビルド
build:
	npm run build

# デプロイ
deploy: build
	firebase deploy
