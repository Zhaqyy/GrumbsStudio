//   precision highp float;
  
//   // uniform vec2 u_resolution;
//   // uniform vec2 u_mouse;
//   uniform float u_time;
//   // uniform sampler2D u_noise;
  
//   // uniform float u_xscale;
  
//   // #define u_time time;
//   // #define time u_time

//   //	Simplex 4D Noise 
//   //	by Ian McEwan, Ashima Arts
//   //
//   vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
//   float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
//   vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
//   float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

//   vec4 grad4(float j, vec4 ip){
//     const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
//     vec4 p,s;

//     p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
//     p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
//     s = vec4(lessThan(p, vec4(0.0)));
//     p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

//     return p;
//   }

//   float snoise(vec4 v){
//     const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
//                           0.309016994374947451); // (sqrt(5) - 1)/4   F4
//   // First corner
//     vec4 i  = floor(v + dot(v, C.yyyy) );
//     vec4 x0 = v -   i + dot(i, C.xxxx);

//   // Other corners

//   // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
//     vec4 i0;

//     vec3 isX = step( x0.yzw, x0.xxx );
//     vec3 isYZ = step( x0.zww, x0.yyz );
//   //  i0.x = dot( isX, vec3( 1.0 ) );
//     i0.x = isX.x + isX.y + isX.z;
//     i0.yzw = 1.0 - isX;

//   //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
//     i0.y += isYZ.x + isYZ.y;
//     i0.zw += 1.0 - isYZ.xy;

//     i0.z += isYZ.z;
//     i0.w += 1.0 - isYZ.z;

//     // i0 now contains the unique values 0,1,2,3 in each channel
//     vec4 i3 = clamp( i0, 0.0, 1.0 );
//     vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
//     vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

//     //  x0 = x0 - 0.0 + 0.0 * C 
//     vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
//     vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
//     vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
//     vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

//   // Permutations
//     i = mod(i, 289.0); 
//     float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
//     vec4 j1 = permute( permute( permute( permute (
//                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
//              + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
//              + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
//              + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
//   // Gradients
//   // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
//   // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

//     vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

//     vec4 p0 = grad4(j0,   ip);
//     vec4 p1 = grad4(j1.x, ip);
//     vec4 p2 = grad4(j1.y, ip);
//     vec4 p3 = grad4(j1.z, ip);
//     vec4 p4 = grad4(j1.w, ip);

//   // Normalise gradients
//     vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
//     p0 *= norm.x;
//     p1 *= norm.y;
//     p2 *= norm.z;
//     p3 *= norm.w;
//     p4 *= taylorInvSqrt(dot(p4,p4));

//   // Mix contributions from the five corners
//     vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
//     vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
//     m0 = m0 * m0;
//     m1 = m1 * m1;
//     return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
//                  + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

//   }

varying vec2 vUv;

//   void main() {
//     vec2 uv =vUv;
//     //  (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
//     float t = u_time * 0.5;
//     float s = sin(t) * 0.1;
//     float c = cos(t) * 0.1;

//    float noiseValue = snoise(vec4(uv * 5.0, s, c)) * 20.0;
    
//     // Depth-based layers with more muted tones
//     vec3 layer1 = vec3(0.6588, 0.3294, 0.0); // Warm muted orange
//     vec3 layer2 = vec3(0.502, 0.1725, 0.0078); // Deeper orange
//     vec3 layer3 = vec3(0.2667, 0.502, 0.0); // Slightly reddish orange
    
//     // Rich color variations
//     vec3 colorVariation1 = vec3(0.2353, 0.2941, 0.4118); // Deep blue
//     vec3 colorVariation2 = vec3(0.6392, 0.0, 0.4784); // Deep purple
    
//     // Combining layers and color variations
//     vec3 blendedColor = mix(
//         mix(layer1, layer2, noiseValue),
//         mix(layer3, colorVariation1, noiseValue),
//         0.5
//     );
    
//     // Adding an extra layer with colorVariation2
//     blendedColor = mix(
//         blendedColor,
//         colorVariation2,
//         smoothstep(0.3, 0.7, sin(noiseValue))
//     );
    

//     gl_FragColor = vec4(blendedColor, 1.0);
//   }






// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define time u_time
#define resolution u_resolution


/*
* @author Hazsi (kinda)
*/
mat2 m(float a) {
    float c=cos(a), s=sin(a);
    return mat2(c,-s,s,c);
}

float map(vec3 p) {
    p.xz *= m(time * 0.4);p.xy*= m(time * 0.1);
    vec3 q = p * 2.0 + time;
    return length(p+vec3(sin(time * 0.7))) * log(length(p) + 1.0) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
}

void main() {
    vec2 a =  vUv - vec2(0.9, 0.5);
    vec3 cl = vec3(0.0);
    float d = 2.5;

    for (int i = 0; i <= 5; i++) {
        vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
        float rz = map(p);
        float f =  clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);
        vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
        cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.6 * l;
        d += min(rz, 1.0);
    }

    gl_FragColor = vec4(cl, 1.0);
}
