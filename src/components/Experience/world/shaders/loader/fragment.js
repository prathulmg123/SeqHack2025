const fragment = /* glsl */ `
  #define layers 2

  uniform float iTime;
  uniform float iAlpha;
  uniform float iLight;
  uniform vec2 iResolution;
  uniform float scale;
  uniform float speed;

  varying vec2 vUv;
  varying vec3 vNormal;

  float PI = 3.141529;

  vec3 hash(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(dot(hash(i + vec3(0, 0, 0)), f - vec3(0, 0, 0)),
            dot(hash(i + vec3(1, 0, 0)), f - vec3(1, 0, 0)), u.x),
        mix(dot(hash(i + vec3(0, 1, 0)), f - vec3(0, 1, 0)),
            dot(hash(i + vec3(1, 1, 0)), f - vec3(1, 1, 0)), u.x),
        u.y
      ),
      mix(
        mix(dot(hash(i + vec3(0, 0, 1)), f - vec3(0, 0, 1)),
            dot(hash(i + vec3(1, 0, 1)), f - vec3(1, 0, 1)), u.x),
        mix(dot(hash(i + vec3(0, 1, 1)), f - vec3(0, 1, 1)),
            dot(hash(i + vec3(1, 1, 1)), f - vec3(1, 1, 1)), u.x),
        u.y
      ),
      u.z
    );
  }

  // Starfield effect
float star(vec2 uv, float t) {
    uv *= 4.0; // Star grid size
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    
    float n = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
    float twinkle = 0.3 + 0.7 * abs(sin(t * 2.0 + n * 6.283)); // subtle flicker
    
    float d = length(gv);
    
    // Make stars tiny sharp points
    float starShape = smoothstep(0.005, 0.002, d);
    
    return starShape * twinkle;
}

float starField(vec2 uv, float t) {
    float s = 0.0;
    vec2 gridUv = uv * 20.0; // More stars and smaller spacing
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            s += star(gridUv + vec2(x, y), t);
        }
    }
    return s;
}



  void main() {
    vec2 uv = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    float t = iTime * speed;

    uv *= scale;

    float h = noise(vec3(uv * 2.0, t));

    // Layered UV distortion
    for (int n = 1; n < layers; n++) {
      float i = float(n);
      uv -= vec2(
        0.7 / i * sin(i * uv.y + i + t * 5.0 + h * i) + 0.8,
        0.4 / i * sin(uv.x + 4. - i + h + t * 5.0 + 0.3 * i) + 1.6
      );
    }

    uv -= vec2(
      1.2 * sin(uv.x + t + h) + 1.8,
      0.4 * sin(uv.y + t + 0.3 * h) + 1.6
    );

    // Base purple glow color
    vec3 baseColor = vec3(54.0 / 255.0, 0.0, 91.0 / 255.0);

    vec3 col = vec3(
      baseColor.r + 0.2 * sin(uv.x + t) * 0.2,
      baseColor.g + 0.1 * sin(uv.y + t * 0.7) * 0.1,
      baseColor.b + 0.3 * sin(uv.x + uv.y + t * 0.5) * 0.3
    ) * iLight;

    // Subtle highlights
    float highlight = 0.2 * sin(uv.x * 2.0 + t) * sin(uv.y * 3.0 + t * 1.5);
    col += vec3(highlight * 0.3, 0.0, highlight * 0.5);

    // Add stars layer
    float stars = star(uv, t);
    col += vec3(stars * 1.5);

    gl_FragColor = vec4(col, iAlpha);
  }
`;

export default fragment;
