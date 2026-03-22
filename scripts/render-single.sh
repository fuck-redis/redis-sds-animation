#!/bin/bash
# 渲染单个视频
# 用法: ./render-single.sh SdsMemoryLayout sds-memory-layout.mp4

COMP=$1
OUTPUT=$2

cd remotion
npx remotion render "$COMP" "../public/videos/$OUTPUT" --overwrite