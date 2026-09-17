@echo off
chcp 65001 >nul
title Cognitive Kernel - Obsidian 一键同步引擎
color 0b

echo ======================================================
echo    Cognitive Kernel - Obsidian 笔记全自动同步发布
echo ======================================================
echo.

cd /d "%~dp0"
node scripts/sync.js

echo.
echo ======================================================
echo   同步结束，按任意键关闭窗口...
echo ======================================================
pause >nul
