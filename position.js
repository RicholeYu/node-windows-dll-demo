const ffi = require('ffi');
const ref = require('ref');
const Struct = require('ref-struct');
var pointStruct = new Struct({
    x: 'long',
    y: 'long'
})
var rectStruct = new Struct({
    left: 'long',
    top: 'long',
    right: 'long',
    bottom: 'long'
})
var rectPtr = ref.refType(rectStruct);
var lpctstr = {
    name: 'lpctstr',
    indirection: 1,
    size: ref.sizeof.pointer,
    get: function(buffer, offset) {
        var _buf = buffer.readPointer(offset);
        if(_buf.isNull()) {
            return null;
        }
        return _buf.readCString(0);
    },
    set: function(buffer, offset, value) {
        var _buf = ref.allocCString(value, 'ucs2');
        return buffer.writePointer(_buf, offset);
    },
    ffi_type: ffi.types.CString.ffi_type
};
let user = ffi.Library('./user32.dll', {
    'MessageBoxExA': ['int32', ['int32', 'string', 'string', 'int32']],
    'MessageBoxA': ['int32', ['int32', 'string', 'string', 'int32']],
    'FindWindowW': ['int', [lpctstr, lpctstr]],
    'GetWindowRect': ['bool', ['int', rectPtr]]
})
var rec = new rectStruct()
// console.log(user.MessageBoxA(null, 'richole', 'hello richole', parseInt('0x00000000L', 16)))

let hwnd = user.FindWindowW(null, '计算器')
console.log(hwnd)
let Rect = user.GetWindowRect(hwnd, rec.ref())

console.log(rec)
