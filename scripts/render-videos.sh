#!/bin/bash
# 渲染所有 Remotion 动画视频

cd remotion

# 定义视频配置：composition名 -> 输出文件名
declare -A VIDEOS=(
  ["SdsMemoryLayout"]="sds-memory-layout.mp4"
  ["CStringVsSds"]="cstring-vs-sds.mp4"
  ["PreAllocation"]="pre-allocation.mp4"
  ["LazyFree"]="lazy-free.mp4"
  ["TypeSwitching"]="type-switching.mp4"
  ["BufferOverflow"]="buffer-overflow.mp4"
  ["BinarySafe"]="binary-safe.mp4"
  ["SdsNewOperation"]="sdsnew-operation.mp4"
  ["SdscatOperation"]="sdscat-operation.mp4"
  ["MakeRoomFor"]="make-room-for.mp4"
  ["TypeSelection"]="type-selection.mp4"
  ["HeroIntro"]="hero-intro.mp4"
)

# 渲染每个视频
for comp in "${!VIDEOS[@]}"; do
  echo "Rendering $comp -> ${VIDEOS[$comp]}"
  npx remotion render "$comp" "../public/videos/${VIDEOS[$comp]}" --overwrite
done

echo "All videos rendered!"