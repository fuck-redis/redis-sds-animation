/**
 * SDS Type Definitions
 * Based on Redis SDS implementation
 */

// SDS类型枚举 - 根据字符串长度选择不同的头部结构
export enum SDSType {
  SDS_TYPE_5 = 'SDS_TYPE_5',   // 最大长度 32 bytes (2^5)
  SDS_TYPE_8 = 'SDS_TYPE_8',   // 最大长度 256 bytes (2^8)
  SDS_TYPE_16 = 'SDS_TYPE_16', // 最大长度 64KB (2^16)
  SDS_TYPE_32 = 'SDS_TYPE_32', // 最大长度 4GB (2^32)
  SDS_TYPE_64 = 'SDS_TYPE_64', // 最大长度 2^64 (理论值)
}

// SDS状态接口 - 完整的SDS数据结构表示
export interface SDSState {
  type: SDSType;           // SDS类型
  len: number;             // 已使用长度（不包含终止符）
  alloc: number;           // 已分配容量（不包含终止符）
  flags: number;           // 标志位（包含类型信息）
  buf: string[];           // 字符缓冲区（包含终止符'\0'）
  originalString: string;  // 原始字符串内容
}

// SDS操作类型枚举
export type SDSOperation =
  // 创建操作
  | 'sdsnew'              // 创建新SDS
  | 'sdsempty'            // 创建空SDS
  | 'sdsdup'              // 复制SDS
  // 修改操作
  | 'sdscat'              // 字符串拼接
  | 'sdscpy'              // 字符串复制（覆盖）
  | 'sdsrange'            // 字符串截取
  | 'sdstrim'             // 字符串裁剪
  // 内存管理操作
  | 'sdsMakeRoomFor'      // 预分配空间
  | 'sdsRemoveFreeSpace'; // 释放空闲空间

// 操作参数接口
export interface OperationParams {
  // sdsnew/sdsdup 参数
  inputString?: string;
  autoDetermineType?: boolean;
  manualType?: SDSType;
  
  // sdscat 参数
  concatString?: string;
  showPreAllocation?: boolean;
  
  // sdscpy 参数
  copyString?: string;
  
  // sdsrange 参数
  startIndex?: number;
  endIndex?: number;
  
  // sdstrim 参数
  trimChars?: string;
  
  // sdsMakeRoomFor 参数
  extraBytes?: number;
}

// 操作验证结果
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// SDS头部大小映射（字节）
export const SDS_HEADER_SIZE: Record<SDSType, number> = {
  [SDSType.SDS_TYPE_5]: 1,   // 1 byte: flags only
  [SDSType.SDS_TYPE_8]: 3,   // 1 + 1 + 1: len + alloc + flags
  [SDSType.SDS_TYPE_16]: 5,  // 2 + 2 + 1: len + alloc + flags
  [SDSType.SDS_TYPE_32]: 9,  // 4 + 4 + 1: len + alloc + flags
  [SDSType.SDS_TYPE_64]: 17, // 8 + 8 + 1: len + alloc + flags
};

// SDS最大长度映射
export const SDS_MAX_LENGTH: Record<SDSType, number> = {
  [SDSType.SDS_TYPE_5]: 32,
  [SDSType.SDS_TYPE_8]: 255,
  [SDSType.SDS_TYPE_16]: 65535,
  [SDSType.SDS_TYPE_32]: 4294967295,
  [SDSType.SDS_TYPE_64]: Number.MAX_SAFE_INTEGER,
};

// 操作分类
export interface OperationCategory {
  name: string;
  description: string;
  operations: SDSOperation[];
  icon: string;
}

export const OPERATION_CATEGORIES: OperationCategory[] = [
  {
    name: '创建操作',
    description: '创建新的SDS字符串',
    operations: ['sdsnew', 'sdsempty', 'sdsdup'],
    icon: 'plus-circle',
  },
  {
    name: '修改操作',
    description: '修改现有SDS内容',
    operations: ['sdscat', 'sdscpy', 'sdsrange', 'sdstrim'],
    icon: 'edit',
  },
  {
    name: '内存管理',
    description: '管理SDS内存分配',
    operations: ['sdsMakeRoomFor', 'sdsRemoveFreeSpace'],
    icon: 'database',
  },
];

// 操作描述映射
export const OPERATION_DESCRIPTIONS: Record<SDSOperation, string> = {
  sdsnew: '根据初始字符串创建新的SDS实例',
  sdsempty: '创建空的SDS字符串',
  sdsdup: '复制现有的SDS字符串',
  sdscat: '将字符串追加到SDS末尾',
  sdscpy: '用新字符串覆盖SDS内容',
  sdsrange: '保留指定范围的字符，删除其他部分',
  sdstrim: '删除字符串两端的指定字符',
  sdsMakeRoomFor: '预分配指定大小的额外空间',
  sdsRemoveFreeSpace: '释放所有未使用的空间',
};
