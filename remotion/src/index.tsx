/**
 * Remotion Entry Point - Exports all video compositions
 */

import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import { SdsIntro } from './videos/SdsIntro';
import { SdsMemoryLayout } from './videos/SdsMemoryLayout';
import { CStringVsSds } from './videos/CStringVsSds';
import { PreAllocation } from './videos/PreAllocation';
import { LazyFree } from './videos/LazyFree';
import { TypeSwitching } from './videos/TypeSwitching';
import { BufferOverflow } from './videos/BufferOverflow';
import { BinarySafe } from './videos/BinarySafe';
import { SdsNewOperation } from './videos/SdsNewOperation';
import { SdscatOperation } from './videos/SdscatOperation';
import { MakeRoomFor } from './videos/MakeRoomFor';
import { TypeSelection } from './videos/TypeSelection';
import { HeroIntro } from './videos/HeroIntro';

export {
  SdsIntro,
  SdsMemoryLayout,
  CStringVsSds,
  PreAllocation,
  LazyFree,
  TypeSwitching,
  BufferOverflow,
  BinarySafe,
  SdsNewOperation,
  SdscatOperation,
  MakeRoomFor,
  TypeSelection,
  HeroIntro,
};

// Video configurations (FPS, duration)
const FPS = 30;

const videoConfigs = {
  SdsMemoryLayout: { fps: FPS, duration: 450 }, // 15s
  CStringVsSds: { fps: FPS, duration: 360 }, // 12s
  PreAllocation: { fps: FPS, duration: 450 }, // 15s
  LazyFree: { fps: FPS, duration: 360 }, // 12s
  TypeSwitching: { fps: FPS, duration: 450 }, // 15s
  BufferOverflow: { fps: FPS, duration: 300 }, // 10s
  BinarySafe: { fps: FPS, duration: 360 }, // 12s
  SdsNewOperation: { fps: FPS, duration: 450 }, // 15s
  SdscatOperation: { fps: FPS, duration: 450 }, // 15s
  MakeRoomFor: { fps: FPS, duration: 450 }, // 15s
  TypeSelection: { fps: FPS, duration: 360 }, // 12s
  HeroIntro: { fps: FPS, duration: 300 }, // 10s
};

registerRoot(() => {
  return (
    <>
      <Composition
        id="SdsMemoryLayout"
        component={SdsMemoryLayout}
        fps={videoConfigs.SdsMemoryLayout.fps}
        durationInFrames={videoConfigs.SdsMemoryLayout.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="CStringVsSds"
        component={CStringVsSds}
        fps={videoConfigs.CStringVsSds.fps}
        durationInFrames={videoConfigs.CStringVsSds.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="PreAllocation"
        component={PreAllocation}
        fps={videoConfigs.PreAllocation.fps}
        durationInFrames={videoConfigs.PreAllocation.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="LazyFree"
        component={LazyFree}
        fps={videoConfigs.LazyFree.fps}
        durationInFrames={videoConfigs.LazyFree.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="TypeSwitching"
        component={TypeSwitching}
        fps={videoConfigs.TypeSwitching.fps}
        durationInFrames={videoConfigs.TypeSwitching.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="BufferOverflow"
        component={BufferOverflow}
        fps={videoConfigs.BufferOverflow.fps}
        durationInFrames={videoConfigs.BufferOverflow.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="BinarySafe"
        component={BinarySafe}
        fps={videoConfigs.BinarySafe.fps}
        durationInFrames={videoConfigs.BinarySafe.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="SdsNewOperation"
        component={SdsNewOperation}
        fps={videoConfigs.SdsNewOperation.fps}
        durationInFrames={videoConfigs.SdsNewOperation.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="SdscatOperation"
        component={SdscatOperation}
        fps={videoConfigs.SdscatOperation.fps}
        durationInFrames={videoConfigs.SdscatOperation.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="MakeRoomFor"
        component={MakeRoomFor}
        fps={videoConfigs.MakeRoomFor.fps}
        durationInFrames={videoConfigs.MakeRoomFor.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="TypeSelection"
        component={TypeSelection}
        fps={videoConfigs.TypeSelection.fps}
        durationInFrames={videoConfigs.TypeSelection.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeroIntro"
        component={HeroIntro}
        fps={videoConfigs.HeroIntro.fps}
        durationInFrames={videoConfigs.HeroIntro.duration}
        width={1920}
        height={1080}
      />
      <Composition
        id="SdsIntro"
        component={SdsIntro}
        fps={30}
        durationInFrames={450}
        width={1920}
        height={1080}
      />
    </>
  );
});
