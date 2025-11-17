/**
 * SDS Operations Implementation
 * Core logic for SDS operations and type determination
 */

import { SDSType, SDSState, SDS_MAX_LENGTH, OperationParams } from '@/types/sds';
import { AnimationStep } from '@/types/animation';

/**
 * 根据字符串长度确定合适的SDS类型
 */
export function determineSdsType(length: number): SDSType {
  if (length < 32) return SDSType.SDS_TYPE_5;
  if (length < 256) return SDSType.SDS_TYPE_8;
  if (length < 65536) return SDSType.SDS_TYPE_16;
  if (length < 4294967296) return SDSType.SDS_TYPE_32;
  return SDSType.SDS_TYPE_64;
}

/**
 * 计算预分配策略
 * Redis SDS预分配策略：小于1MB时翻倍，大于等于1MB时增加1MB
 */
export function calculatePreAllocation(currentLen: number, additionalLen: number): number {
  const newLen = currentLen + additionalLen;
  const SDS_MAX_PREALLOC = 1024 * 1024; // 1MB
  
  if (newLen < SDS_MAX_PREALLOC) {
    return newLen * 2;
  } else {
    return newLen + SDS_MAX_PREALLOC;
  }
}

/**
 * 创建新的SDS - sdsnew
 */
export function sdsnew(initString: string, manualType?: SDSType): SDSState {
  const len = initString.length;
  const type = manualType || determineSdsType(len);
  
  // 初始分配时，alloc = len
  const alloc = len;
  const buf = [...initString.split(''), '\0'];
  
  return {
    type,
    len,
    alloc,
    flags: getFlags(type),
    buf,
    originalString: initString,
  };
}

/**
 * 创建空SDS - sdsempty
 */
export function sdsempty(): SDSState {
  return {
    type: SDSType.SDS_TYPE_5,
    len: 0,
    alloc: 0,
    flags: getFlags(SDSType.SDS_TYPE_5),
    buf: ['\0'],
    originalString: '',
  };
}

/**
 * 复制SDS - sdsdup
 */
export function sdsdup(source: SDSState): SDSState {
  return {
    ...source,
    buf: [...source.buf],
    originalString: source.originalString,
  };
}

/**
 * 字符串拼接 - sdscat
 */
export function sdscat(sds: SDSState, appendStr: string): SDSState {
  const newLen = sds.len + appendStr.length;
  let newAlloc = sds.alloc;
  let newType = sds.type;
  let newBuf = [...sds.buf];
  
  // 检查是否需要扩展空间
  if (newLen > sds.alloc) {
    newAlloc = calculatePreAllocation(sds.len, appendStr.length);
    newType = determineSdsType(newAlloc);
    
    // 重新分配缓冲区
    newBuf = new Array(newAlloc + 1).fill('');
    // 复制原有数据
    for (let i = 0; i < sds.len; i++) {
      newBuf[i] = sds.buf[i];
    }
  }
  
  // 追加新字符串
  const appendChars = appendStr.split('');
  for (let i = 0; i < appendChars.length; i++) {
    newBuf[sds.len + i] = appendChars[i];
  }
  
  // 添加终止符
  newBuf[newLen] = '\0';
  
  return {
    type: newType,
    len: newLen,
    alloc: newAlloc,
    flags: getFlags(newType),
    buf: newBuf,
    originalString: sds.originalString + appendStr,
  };
}

/**
 * 字符串复制 - sdscpy
 */
export function sdscpy(sds: SDSState, copyStr: string): SDSState {
  const newLen = copyStr.length;
  let newAlloc = sds.alloc;
  let newType = sds.type;
  let newBuf = [...sds.buf];
  
  // 检查空间是否足够
  if (newLen > sds.alloc) {
    newAlloc = newLen;
    newType = determineSdsType(newAlloc);
    newBuf = new Array(newAlloc + 1).fill('');
  }
  
  // 复制新字符串
  const copyChars = copyStr.split('');
  for (let i = 0; i < copyChars.length; i++) {
    newBuf[i] = copyChars[i];
  }
  
  // 添加终止符
  newBuf[newLen] = '\0';
  
  // 清空剩余空间
  for (let i = newLen + 1; i < newBuf.length; i++) {
    newBuf[i] = '';
  }
  
  return {
    type: newType,
    len: newLen,
    alloc: newAlloc,
    flags: getFlags(newType),
    buf: newBuf,
    originalString: copyStr,
  };
}

/**
 * 字符串截取 - sdsrange
 */
export function sdsrange(sds: SDSState, start: number, end: number): SDSState {
  // 边界检查
  const validStart = Math.max(0, start);
  const validEnd = Math.min(sds.len - 1, end);
  
  if (validStart > validEnd) {
    return sdsempty();
  }
  
  const newLen = validEnd - validStart + 1;
  const newBuf = [...sds.buf];
  
  // 移动字符到开头
  for (let i = 0; i < newLen; i++) {
    newBuf[i] = sds.buf[validStart + i];
  }
  
  // 添加终止符
  newBuf[newLen] = '\0';
  
  // 清空剩余空间
  for (let i = newLen + 1; i < newBuf.length; i++) {
    newBuf[i] = '';
  }
  
  const newString = sds.originalString.substring(validStart, validEnd + 1);
  
  return {
    ...sds,
    len: newLen,
    buf: newBuf,
    originalString: newString,
  };
}

/**
 * 字符串裁剪 - sdstrim
 */
export function sdstrim(sds: SDSState, trimChars: string): SDSState {
  const trimSet = new Set(trimChars.split(''));
  let start = 0;
  let end = sds.len - 1;
  
  // 从开头查找第一个不在trimSet中的字符
  while (start <= end && trimSet.has(sds.buf[start])) {
    start++;
  }
  
  // 从结尾查找最后一个不在trimSet中的字符
  while (end >= start && trimSet.has(sds.buf[end])) {
    end--;
  }
  
  if (start > end) {
    return sdsempty();
  }
  
  return sdsrange(sds, start, end);
}

/**
 * 预分配空间 - sdsMakeRoomFor
 */
export function sdsMakeRoomFor(sds: SDSState, extraBytes: number): SDSState {
  const requiredAlloc = sds.len + extraBytes;
  
  if (requiredAlloc <= sds.alloc) {
    // 空间已足够
    return sds;
  }
  
  const newAlloc = calculatePreAllocation(sds.len, extraBytes);
  const newType = determineSdsType(newAlloc);
  const newBuf = new Array(newAlloc + 1).fill('');
  
  // 复制现有数据
  for (let i = 0; i <= sds.len; i++) {
    newBuf[i] = sds.buf[i];
  }
  
  return {
    type: newType,
    len: sds.len,
    alloc: newAlloc,
    flags: getFlags(newType),
    buf: newBuf,
    originalString: sds.originalString,
  };
}

/**
 * 释放空闲空间 - sdsRemoveFreeSpace
 */
export function sdsRemoveFreeSpace(sds: SDSState): SDSState {
  if (sds.len === sds.alloc) {
    return sds; // 没有空闲空间
  }
  
  const newAlloc = sds.len;
  const newType = determineSdsType(newAlloc);
  const newBuf = new Array(newAlloc + 1).fill('');
  
  // 复制现有数据
  for (let i = 0; i <= sds.len; i++) {
    newBuf[i] = sds.buf[i];
  }
  
  return {
    type: newType,
    len: sds.len,
    alloc: newAlloc,
    flags: getFlags(newType),
    buf: newBuf,
    originalString: sds.originalString,
  };
}

/**
 * 获取SDS类型对应的flags值
 */
function getFlags(type: SDSType): number {
  const flagsMap: Record<SDSType, number> = {
    [SDSType.SDS_TYPE_5]: 0,
    [SDSType.SDS_TYPE_8]: 1,
    [SDSType.SDS_TYPE_16]: 2,
    [SDSType.SDS_TYPE_32]: 3,
    [SDSType.SDS_TYPE_64]: 4,
  };
  return flagsMap[type];
}

/**
 * 验证操作参数
 */
export function validateOperationParams(
  operation: string,
  params: OperationParams,
  currentState?: SDSState
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  switch (operation) {
    case 'sdsnew':
      if (!params.inputString && params.inputString !== '') {
        errors.push('请输入初始字符串');
      }
      if (params.inputString && params.inputString.length > SDS_MAX_LENGTH[SDSType.SDS_TYPE_64]) {
        errors.push('字符串长度超出限制');
      }
      break;
      
    case 'sdscat':
      if (!params.concatString) {
        errors.push('请输入要拼接的字符串');
      }
      if (!currentState) {
        errors.push('没有可用的SDS实例');
      }
      break;
      
    case 'sdscpy':
      if (!params.copyString && params.copyString !== '') {
        errors.push('请输入要复制的字符串');
      }
      if (!currentState) {
        errors.push('没有可用的SDS实例');
      }
      break;
      
    case 'sdsrange':
      if (params.startIndex === undefined || params.endIndex === undefined) {
        errors.push('请输入起始和结束索引');
      }
      if (currentState && params.startIndex !== undefined && params.endIndex !== undefined) {
        if (params.startIndex < 0 || params.startIndex >= currentState.len) {
          errors.push('起始索引超出范围');
        }
        if (params.endIndex < 0 || params.endIndex >= currentState.len) {
          errors.push('结束索引超出范围');
        }
        if (params.startIndex > params.endIndex) {
          errors.push('起始索引不能大于结束索引');
        }
      }
      if (!currentState) {
        errors.push('没有可用的SDS实例');
      }
      break;
      
    case 'sdstrim':
      if (!params.trimChars) {
        errors.push('请输入要裁剪的字符');
      }
      if (!currentState) {
        errors.push('没有可用的SDS实例');
      }
      break;
      
    case 'sdsMakeRoomFor':
      if (params.extraBytes === undefined || params.extraBytes <= 0) {
        errors.push('请输入有效的额外字节数');
      }
      if (!currentState) {
        errors.push('没有可用的SDS实例');
      }
      break;
      
    case 'sdsdup':
    case 'sdsRemoveFreeSpace':
      if (!currentState) {
        errors.push('没有可用的SDS实例');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
