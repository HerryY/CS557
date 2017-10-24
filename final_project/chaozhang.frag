#version 330 compatibility

in vec3  vMCposition;
in vec4  vColor;
in float vLightIntensity;
in vec2  vST;
in float z;

uniform bool  UseDiscard;
uniform float Ad;
uniform float Bd;
uniform vec4 mColor;
uniform float NoiseAmp;
uniform	float NoiseFreq;
uniform sampler3D Noise3;
uniform float Tol;
uniform float Alpha;
uniform bool UseChromaDepth;
uniform float ChromaRed;
uniform float ChromaBlue;

vec3
ChromaDepth( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}

void
main( )
{
	vec4 nv = texture3D( Noise3, NoiseFreq * vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	n = n - 2.;				// -1. -> 1.
	float delta = NoiseAmp * n;
	float s = vST.s;
	float t = vST.t;
	float up = 2. * s;
	float vp = t;
	up += delta;
	vp += delta;
	int numins = int( up / Ad);
	int numint = int( vp / Bd);
	float Ar = Ad/2;
	float Br = Bd/2;

	gl_FragColor = vColor;		// default color

	if( ( (numins+numint) % 1 ) == 0. )
	{
		float uc = numins*2. * Ar + Ar;
		float vc = numint*2. * Br + Br;
		up = (up - uc)/Ar;
		vp = (vp - vc)/Br;
		float d = up * up + vp * vp;
		if( abs(d - 1) <= Tol )
		{
			float m = smoothstep( 1 - Tol, 1 + Tol, d);
			gl_FragColor = mix( mColor, vColor, m);
		}
		if( d <= 1.-Tol )
		{
			if( UseChromaDepth )       			{      
				float t = (2./3.) * ( z - ChromaRed ) / ( ChromaBlue - ChromaRed );
				t = clamp( t, 0., 2./3. );
				gl_FragColor = vec4( ChromaDepth( t ) , 1. );
			}
			else
			{
				gl_FragColor = mColor;
			}
		}
		if( d >= 1.+Tol )
		{
			if( UseDiscard )    
			{
				discard;
			}
			else
			{
				gl_FragColor = vec4( 1, 1, 0, Alpha);
			}
		}			
	}

	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}
