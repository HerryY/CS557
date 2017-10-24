#version 330 compatibility


out vec3  vMCposition;
out vec4  vColor;
out float vLightIntensity;
out vec2  vST;
out float z;

const vec3 LIGHTPOS = vec3( -2., 0., 10. );

void
main( )
{
gl_Position = gl_Vertex;
}
