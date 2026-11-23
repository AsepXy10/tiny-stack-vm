// Tiny stack VM for make.fun tiny-stack-vm-01: the ISA in the kit
// (generator/subject/ISA.md) exactly as its reference VM does
// (generator/subject/vm.mjs): 32-bit wrapping ints, 256-value stack,
// 64-deep call stack, 256 words of memory, 1e6 steps, 65536 output
// bytes, ten traps with their own exit codes. D data stack, C call
// stack, M memory, o output; s/c/x/t/l/i are sp, csp, pc, steps, olen, inpos.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,x=0,t=0,l=0,i=0;
 const n=p.length,T=a=>[o.subarray(0,l),a];
 for(;;){
  if(t==1e6)return T(10);
  if(x<0||x>=n)return T(9);
  const k=p[x];
  if(!(k<8||k>15&&k<35||k>47&&k<53||k>63&&k<66||k>79&&k<84))return T(5);
  const m=k==1?1:k==2?4:k>47&&k<52?2:0;
  if(x+m>=n)return T(9);
  t++;const y=x+1+m;
  const u=k<8?[0,0,0,1,1,2,2,3][k]:k<48?(k==23||k==27?1:2):k<64?(k==49||k==50?1:0):k<80?(k==64?1:2):k==82?0:1;
  const v=k<8?[0,1,1,0,2,2,3,3][k]:k<48?1:k==64||k==82?1:0;
  if(s<u)return T(2);
  if(s-u+v>256)return T(3);
  x=y;
  switch(k){
   case 0:return T(0);
   case 1:D[s++]=(p[y-1]<<24)>>24;break;
   case 2:D[s++]=p[y-4]|p[y-3]<<8|p[y-2]<<16|p[y-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const a=D[s-1];D[s-1]=D[s-2];D[s-2]=a;break;}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break;}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:case 49:case 50:{const r=(p[y-2]|p[y-1]<<8)<<16>>16;let g=k==48;if(!g){const a=D[--s];g=k==49?a==0:a!=0}if(g)x=y+r;break;}
   case 51:if(c==64)return T(7);C[c++]=y;x=p[y-2]|p[y-1]<<8;break;
   case 52:if(!c)return T(8);x=C[--c];break;
   case 64:{const a=D[s-1];if(a<0||a>255)return T(6);D[s-1]=M[a];break;}
   case 65:{const a=D[s-1],b=D[s-2];if(a<0||a>255)return T(6);s-=2;M[a]=b;break;}
   case 80:{const z=String(D[s-1]);if(l+z.length>65536)return T(11);s--;for(let j=0;j<z.length;j++)o[l++]=z.charCodeAt(j);break;}
   case 81:if(l+1>65536)return T(11);o[l++]=D[--s]&255;break;
   case 82:D[s++]=i<q.length?q[i++]:-1;break;
   case 83:return T(D[--s]&255);
   default:{const b=D[s-1],a=D[s-2];let r;
    if(k==16)r=a+b|0;else if(k==17)r=a-b|0;else if(k==18)r=Math.imul(a,b);
    else if(k==19){if(!b)return T(4);r=a==-2147483648&&b==-1?a:a/b|0}
    else if(k==20){if(!b)return T(4);r=b==-1?0:a%b|0}
    else if(k==21){if(!b)return T(4);r=Math.floor((a>>>0)/(b>>>0))|0}
    else if(k==22){if(!b)return T(4);r=(a>>>0)%(b>>>0)|0}
    else if(k==24)r=a&b;else if(k==25)r=a|b;else if(k==26)r=a^b;
    else if(k==28)r=a<<(b&31);else if(k==29)r=a>>(b&31);else if(k==30)r=a>>>(b&31)|0;
    else if(k==32)r=a==b?1:0;else if(k==33)r=a<b?1:0;else r=(a>>>0)<(b>>>0)?1:0;
    s-=2;D[s++]=r;}
  }
 }
}
const I=process.env.MAKEFUN_INPUT_DIR||'/input',O=process.env.MAKEFUN_OUTPUT_DIR||'/output';
for(const d of readdirSync(I).sort()){
 const r=run(new Uint8Array(readFileSync(join(I,d,'program.bin'))),new Uint8Array(readFileSync(join(I,d,'input.bin'))));
 mkdirSync(join(O,d),{recursive:true});writeFileSync(join(O,d,'stdout.bin'),r[0]);writeFileSync(join(O,d,'exit.txt'),r[1]+'\n');
}
