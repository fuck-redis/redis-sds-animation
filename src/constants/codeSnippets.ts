import { SDSOperation } from '@/types/sds';
import { SupportedLanguage } from '@/types/animation';

interface OperationCodeSnippets {
  title: string;
  snippets: Record<SupportedLanguage, string>;
}

export const DEFAULT_LANGUAGE: SupportedLanguage = 'java';

export const OPERATION_CODE_SNIPPETS: Record<SDSOperation, OperationCodeSnippets> = {
  sdsnew: {
    title: 'sdsnew: 创建新字符串',
    snippets: {
      java: `public SDSState sdsnew(String init) {
  int len = init.length();
  SDSType type = determineType(len);
  int alloc = len;
  char[] buf = new char[alloc + 1];
  for (int i = 0; i < len; i++) {
    buf[i] = init.charAt(i);
  }
  buf[len] = '\\0';
  return new SDSState(type, len, alloc, buf, init);
}`,
      python: `def sdsnew(init: str) -> SDSState:
    length = len(init)
    sds_type = determine_type(length)
    alloc = length
    buf = [''] * (alloc + 1)
    for i, ch in enumerate(init):
        buf[i] = ch
    buf[length] = '\\0'
    return SDSState(sds_type, length, alloc, buf, init)`,
      go: `func sdsnew(init string) SDSState {
    length := len(init)
    sdsType := determineType(length)
    alloc := length
    buf := make([]string, alloc+1)
    for i, ch := range init {
        buf[i] = string(ch)
    }
    buf[length] = "\\0"
    return SDSState{Type: sdsType, Len: length, Alloc: alloc, Buf: buf, Raw: init}
}`,
      javascript: `function sdsnew(init) {
  const len = init.length;
  const type = determineType(len);
  const alloc = len;
  const buf = Array.from({ length: alloc + 1 }, () => '');
  for (let i = 0; i < len; i++) {
    buf[i] = init[i];
  }
  buf[len] = '\\0';
  return { type, len, alloc, buf, originalString: init };
}`,
    },
  },
  sdsempty: {
    title: 'sdsempty: 创建空字符串',
    snippets: {
      java: `public SDSState sdsempty() {
  return new SDSState(
    SDSType.SDS_TYPE_5,
    0,
    0,
    new char[] {'\\0'},
    ""
  );
}`,
      python: `def sdsempty() -> SDSState:
    return SDSState(
        SDSType.SDS_TYPE_5,
        0,
        0,
        ['\\0'],
        ""
    )`,
      go: `func sdsempty() SDSState {
    return SDSState{
        Type: SDSType5,
        Len: 0,
        Alloc: 0,
        Buf: []string{"\\0"},
        Raw: "",
    }
}`,
      javascript: `function sdsempty() {
  return {
    type: 'SDS_TYPE_5',
    len: 0,
    alloc: 0,
    buf: ['\\0'],
    originalString: ''
  };
}`,
    },
  },
  sdsdup: {
    title: 'sdsdup: 拷贝字符串',
    snippets: {
      java: `public SDSState sdsdup(SDSState src) {
  char[] copied = Arrays.copyOf(src.buf, src.buf.length);
  return new SDSState(
    src.type,
    src.len,
    src.alloc,
    copied,
    src.originalString
  );
}`,
      python: `def sdsdup(src: SDSState) -> SDSState:
    copied = list(src.buf)
    return SDSState(
        src.type,
        src.len,
        src.alloc,
        copied,
        src.original_string
    )`,
      go: `func sdsdup(src SDSState) SDSState {
    copied := make([]string, len(src.Buf))
    copy(copied, src.Buf)
    return SDSState{
        Type: src.Type, Len: src.Len, Alloc: src.Alloc,
        Buf: copied, Raw: src.Raw,
    }
}`,
      javascript: `function sdsdup(src) {
  const copied = [...src.buf];
  return {
    type: src.type,
    len: src.len,
    alloc: src.alloc,
    buf: copied,
    originalString: src.originalString
  };
}`,
    },
  },
  sdscat: {
    title: 'sdscat: 追加字符串',
    snippets: {
      java: `public SDSState sdscat(SDSState sds, String append) {
  int newLen = sds.len + append.length();
  int newAlloc = sds.alloc;
  char[] newBuf = Arrays.copyOf(sds.buf, sds.buf.length);
  if (newLen > sds.alloc) {
    newAlloc = preAllocate(sds.len, append.length());
    newBuf = new char[newAlloc + 1];
    for (int i = 0; i < sds.len; i++) newBuf[i] = sds.buf[i];
  }
  for (int i = 0; i < append.length(); i++) {
    newBuf[sds.len + i] = append.charAt(i);
  }
  newBuf[newLen] = '\\0';
  return new SDSState(determineType(newAlloc), newLen, newAlloc, newBuf, sds.originalString + append);
}`,
      python: `def sdscat(sds: SDSState, append: str) -> SDSState:
    new_len = sds.len + len(append)
    new_alloc = sds.alloc
    new_buf = list(sds.buf)
    if new_len > sds.alloc:
        new_alloc = pre_allocate(sds.len, len(append))
        new_buf = [''] * (new_alloc + 1)
        for i in range(sds.len):
            new_buf[i] = sds.buf[i]
    for i, ch in enumerate(append):
        new_buf[sds.len + i] = ch
    new_buf[new_len] = '\\0'
    return SDSState(determine_type(new_alloc), new_len, new_alloc, new_buf, sds.original_string + append)`,
      go: `func sdscat(sds SDSState, append string) SDSState {
    newLen := sds.Len + len(append)
    newAlloc := sds.Alloc
    newBuf := append([]string{}, sds.Buf...)
    if newLen > sds.Alloc {
        newAlloc = preAllocate(sds.Len, len(append))
        newBuf = make([]string, newAlloc+1)
        copy(newBuf, sds.Buf[:sds.Len])
    }
    for i, ch := range append {
        newBuf[sds.Len+i] = string(ch)
    }
    newBuf[newLen] = "\\0"
    return SDSState{Type: determineType(newAlloc), Len: newLen, Alloc: newAlloc, Buf: newBuf, Raw: sds.Raw + append}
}`,
      javascript: `function sdscat(sds, append) {
  const newLen = sds.len + append.length;
  let newAlloc = sds.alloc;
  let newBuf = [...sds.buf];
  if (newLen > sds.alloc) {
    newAlloc = preAllocate(sds.len, append.length);
    newBuf = Array.from({ length: newAlloc + 1 }, () => '');
    for (let i = 0; i < sds.len; i++) newBuf[i] = sds.buf[i];
  }
  for (let i = 0; i < append.length; i++) newBuf[sds.len + i] = append[i];
  newBuf[newLen] = '\\0';
  return { type: determineType(newAlloc), len: newLen, alloc: newAlloc, buf: newBuf, originalString: sds.originalString + append };
}`,
    },
  },
  sdscpy: {
    title: 'sdscpy: 覆盖字符串',
    snippets: {
      java: `public SDSState sdscpy(SDSState sds, String value) {
  int newLen = value.length();
  int newAlloc = sds.alloc;
  char[] newBuf = Arrays.copyOf(sds.buf, sds.buf.length);
  if (newLen > sds.alloc) {
    newAlloc = newLen;
    newBuf = new char[newAlloc + 1];
  }
  for (int i = 0; i < newLen; i++) newBuf[i] = value.charAt(i);
  newBuf[newLen] = '\\0';
  return new SDSState(determineType(newAlloc), newLen, newAlloc, newBuf, value);
}`,
      python: `def sdscpy(sds: SDSState, value: str) -> SDSState:
    new_len = len(value)
    new_alloc = sds.alloc
    new_buf = list(sds.buf)
    if new_len > sds.alloc:
        new_alloc = new_len
        new_buf = [''] * (new_alloc + 1)
    for i, ch in enumerate(value):
        new_buf[i] = ch
    new_buf[new_len] = '\\0'
    return SDSState(determine_type(new_alloc), new_len, new_alloc, new_buf, value)`,
      go: `func sdscpy(sds SDSState, value string) SDSState {
    newLen := len(value)
    newAlloc := sds.Alloc
    newBuf := append([]string{}, sds.Buf...)
    if newLen > sds.Alloc {
        newAlloc = newLen
        newBuf = make([]string, newAlloc+1)
    }
    for i, ch := range value {
        newBuf[i] = string(ch)
    }
    newBuf[newLen] = "\\0"
    return SDSState{Type: determineType(newAlloc), Len: newLen, Alloc: newAlloc, Buf: newBuf, Raw: value}
}`,
      javascript: `function sdscpy(sds, value) {
  const newLen = value.length;
  let newAlloc = sds.alloc;
  let newBuf = [...sds.buf];
  if (newLen > sds.alloc) {
    newAlloc = newLen;
    newBuf = Array.from({ length: newAlloc + 1 }, () => '');
  }
  for (let i = 0; i < newLen; i++) newBuf[i] = value[i];
  newBuf[newLen] = '\\0';
  return { type: determineType(newAlloc), len: newLen, alloc: newAlloc, buf: newBuf, originalString: value };
}`,
    },
  },
  sdsrange: {
    title: 'sdsrange: 保留区间',
    snippets: {
      java: `public SDSState sdsrange(SDSState sds, int start, int end) {
  int validStart = Math.max(0, start);
  int validEnd = Math.min(sds.len - 1, end);
  if (validStart > validEnd) return sdsempty();
  int newLen = validEnd - validStart + 1;
  char[] newBuf = Arrays.copyOf(sds.buf, sds.buf.length);
  for (int i = 0; i < newLen; i++) {
    newBuf[i] = sds.buf[validStart + i];
  }
  newBuf[newLen] = '\\0';
  return new SDSState(sds.type, newLen, sds.alloc, newBuf, sds.originalString.substring(validStart, validEnd + 1));
}`,
      python: `def sdsrange(sds: SDSState, start: int, end: int) -> SDSState:
    valid_start = max(0, start)
    valid_end = min(sds.len - 1, end)
    if valid_start > valid_end:
        return sdsempty()
    new_len = valid_end - valid_start + 1
    new_buf = list(sds.buf)
    for i in range(new_len):
        new_buf[i] = sds.buf[valid_start + i]
    new_buf[new_len] = '\\0'
    return SDSState(sds.type, new_len, sds.alloc, new_buf, sds.original_string[valid_start: valid_end + 1])`,
      go: `func sdsrange(sds SDSState, start, end int) SDSState {
    validStart := max(0, start)
    validEnd := min(sds.Len-1, end)
    if validStart > validEnd {
        return sdsempty()
    }
    newLen := validEnd - validStart + 1
    newBuf := append([]string{}, sds.Buf...)
    for i := 0; i < newLen; i++ {
        newBuf[i] = sds.Buf[validStart+i]
    }
    newBuf[newLen] = "\\0"
    return SDSState{Type: sds.Type, Len: newLen, Alloc: sds.Alloc, Buf: newBuf, Raw: sds.Raw[validStart : validEnd+1]}
}`,
      javascript: `function sdsrange(sds, start, end) {
  const validStart = Math.max(0, start);
  const validEnd = Math.min(sds.len - 1, end);
  if (validStart > validEnd) return sdsempty();
  const newLen = validEnd - validStart + 1;
  const newBuf = [...sds.buf];
  for (let i = 0; i < newLen; i++) newBuf[i] = sds.buf[validStart + i];
  newBuf[newLen] = '\\0';
  return { ...sds, len: newLen, buf: newBuf, originalString: sds.originalString.substring(validStart, validEnd + 1) };
}`,
    },
  },
  sdstrim: {
    title: 'sdstrim: 两端裁剪',
    snippets: {
      java: `public SDSState sdstrim(SDSState sds, String trimChars) {
  Set<Character> trimSet = toSet(trimChars);
  int start = 0, end = sds.len - 1;
  while (start <= end && trimSet.contains(sds.buf[start])) start++;
  while (end >= start && trimSet.contains(sds.buf[end])) end--;
  if (start > end) return sdsempty();
  return sdsrange(sds, start, end);
}`,
      python: `def sdstrim(sds: SDSState, trim_chars: str) -> SDSState:
    trim_set = set(trim_chars)
    start, end = 0, sds.len - 1
    while start <= end and sds.buf[start] in trim_set:
        start += 1
    while end >= start and sds.buf[end] in trim_set:
        end -= 1
    if start > end:
        return sdsempty()
    return sdsrange(sds, start, end)`,
      go: `func sdstrim(sds SDSState, trimChars string) SDSState {
    trimSet := toCharSet(trimChars)
    start, end := 0, sds.Len-1
    for start <= end && trimSet[sds.Buf[start]] {
        start++
    }
    for end >= start && trimSet[sds.Buf[end]] {
        end--
    }
    if start > end {
        return sdsempty()
    }
    return sdsrange(sds, start, end)
}`,
      javascript: `function sdstrim(sds, trimChars) {
  const trimSet = new Set(trimChars.split(''));
  let start = 0;
  let end = sds.len - 1;
  while (start <= end && trimSet.has(sds.buf[start])) start++;
  while (end >= start && trimSet.has(sds.buf[end])) end--;
  if (start > end) return sdsempty();
  return sdsrange(sds, start, end);
}`,
    },
  },
  sdsMakeRoomFor: {
    title: 'sdsMakeRoomFor: 预分配',
    snippets: {
      java: `public SDSState sdsMakeRoomFor(SDSState sds, int extraBytes) {
  int required = sds.len + extraBytes;
  if (required <= sds.alloc) return sds;
  int newAlloc = preAllocate(sds.len, extraBytes);
  char[] newBuf = new char[newAlloc + 1];
  for (int i = 0; i <= sds.len; i++) newBuf[i] = sds.buf[i];
  return new SDSState(determineType(newAlloc), sds.len, newAlloc, newBuf, sds.originalString);
}`,
      python: `def sdsMakeRoomFor(sds: SDSState, extra_bytes: int) -> SDSState:
    required = sds.len + extra_bytes
    if required <= sds.alloc:
        return sds
    new_alloc = pre_allocate(sds.len, extra_bytes)
    new_buf = [''] * (new_alloc + 1)
    for i in range(sds.len + 1):
        new_buf[i] = sds.buf[i]
    return SDSState(determine_type(new_alloc), sds.len, new_alloc, new_buf, sds.original_string)`,
      go: `func sdsMakeRoomFor(sds SDSState, extraBytes int) SDSState {
    required := sds.Len + extraBytes
    if required <= sds.Alloc {
        return sds
    }
    newAlloc := preAllocate(sds.Len, extraBytes)
    newBuf := make([]string, newAlloc+1)
    copy(newBuf, sds.Buf[:sds.Len+1])
    return SDSState{Type: determineType(newAlloc), Len: sds.Len, Alloc: newAlloc, Buf: newBuf, Raw: sds.Raw}
}`,
      javascript: `function sdsMakeRoomFor(sds, extraBytes) {
  const required = sds.len + extraBytes;
  if (required <= sds.alloc) return sds;
  const newAlloc = preAllocate(sds.len, extraBytes);
  const newBuf = Array.from({ length: newAlloc + 1 }, () => '');
  for (let i = 0; i <= sds.len; i++) newBuf[i] = sds.buf[i];
  return { ...sds, type: determineType(newAlloc), alloc: newAlloc, buf: newBuf };
}`,
    },
  },
  sdsRemoveFreeSpace: {
    title: 'sdsRemoveFreeSpace: 回收空闲空间',
    snippets: {
      java: `public SDSState sdsRemoveFreeSpace(SDSState sds) {
  if (sds.len == sds.alloc) return sds;
  int newAlloc = sds.len;
  char[] newBuf = new char[newAlloc + 1];
  for (int i = 0; i <= sds.len; i++) {
    newBuf[i] = sds.buf[i];
  }
  return new SDSState(determineType(newAlloc), sds.len, newAlloc, newBuf, sds.originalString);
}`,
      python: `def sdsRemoveFreeSpace(sds: SDSState) -> SDSState:
    if sds.len == sds.alloc:
        return sds
    new_alloc = sds.len
    new_buf = [''] * (new_alloc + 1)
    for i in range(sds.len + 1):
        new_buf[i] = sds.buf[i]
    return SDSState(determine_type(new_alloc), sds.len, new_alloc, new_buf, sds.original_string)`,
      go: `func sdsRemoveFreeSpace(sds SDSState) SDSState {
    if sds.Len == sds.Alloc {
        return sds
    }
    newAlloc := sds.Len
    newBuf := make([]string, newAlloc+1)
    copy(newBuf, sds.Buf[:sds.Len+1])
    return SDSState{Type: determineType(newAlloc), Len: sds.Len, Alloc: newAlloc, Buf: newBuf, Raw: sds.Raw}
}`,
      javascript: `function sdsRemoveFreeSpace(sds) {
  if (sds.len === sds.alloc) return sds;
  const newAlloc = sds.len;
  const newBuf = Array.from({ length: newAlloc + 1 }, () => '');
  for (let i = 0; i <= sds.len; i++) newBuf[i] = sds.buf[i];
  return { ...sds, type: determineType(newAlloc), alloc: newAlloc, buf: newBuf };
}`,
    },
  },
};

export function getSnippet(operation: SDSOperation | null, language: SupportedLanguage) {
  if (!operation) return '';
  return OPERATION_CODE_SNIPPETS[operation].snippets[language];
}

// 扁平化导出用于教学页面
export const codeSnippets = {
  sdsnew: OPERATION_CODE_SNIPPETS.sdsnew.snippets,
  sdsempty: OPERATION_CODE_SNIPPETS.sdsempty.snippets,
  sdsdup: OPERATION_CODE_SNIPPETS.sdsdup.snippets,
  sdscat: OPERATION_CODE_SNIPPETS.sdscat.snippets,
  sdscpy: OPERATION_CODE_SNIPPETS.sdscpy.snippets,
  sdsrange: OPERATION_CODE_SNIPPETS.sdsrange.snippets,
  sdstrim: OPERATION_CODE_SNIPPETS.sdstrim.snippets,
  sdsMakeRoomFor: OPERATION_CODE_SNIPPETS.sdsMakeRoomFor.snippets,
  sdsRemoveFreeSpace: OPERATION_CODE_SNIPPETS.sdsRemoveFreeSpace.snippets,
};
