const utf8 = {
    encoding(string) {
      let size = string.length * 2;
  
      let bytes = new Uint8Array(size);
      let byteOffset = 0;
      for(let i = 0, j = string.length; i < j; i++) {
  
        let charCode = string.codePointAt(i);
        let nbytes = utf8._bytesForChar(charCode);
        if (nbytes==4) i+=1;
        if (nbytes + byteOffset >size) {
          size = string.length * 4;
          let newBytes = new Uint8Array(size);
          newBytes.set(bytes);
          bytes = newBytes;
        }
  
        if(1 == nbytes) {
          bytes[byteOffset++] = charCode;
        } else {
          let pad = (15 >> (4-nbytes)) << (8-nbytes);
          bytes[byteOffset++] = pad + (charCode >>> ((--nbytes) * 6));
          while(nbytes > 0) {
            bytes[byteOffset++] = ((charCode >>> ((--nbytes) * 6)) & 0x3F) | 0x80;
          }
        }
      }
      bytes = bytes.subarray(0, byteOffset);
      return bytes;
    },
  
    _bytesForChar(charCode) {
      if(charCode < 128) {
        return 1;
      } else if(charCode < 2048) {
        return 2;
      } else if(charCode < 65536) {
        return 3;
      } else if(charCode < 2097152) {
        return 4;
      }
    }
  }
  
  console.log(utf8.encoding('啊'));
  