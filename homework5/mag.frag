#version 330 compatibility

uniform bool		Circle;
uniform float 		Scenter;
uniform float 		Tcenter;
uniform float 		Ds;
uniform float 		Dt;
uniform float 		MagFactor;
uniform float 		RotAngle;
uniform float       SharpFactor;
uniform sampler2D   ImageUnit;


in vec2  vST;
float	 ResS, ResT;


void
main( )
{
	float s = vST.s;
	float t = vST.t;
	vec3 color  = texture2D( ImageUnit, vST ).rgb;
	
	ivec2 ires = textureSize( ImageUnit, 0 );
	ResS = float( ires.s );
	ResT = float( ires.t );


	vec2 st = vST;

	
	float top = Scenter + Ds;
	float bottom = Scenter - Ds;
	float right = Tcenter + Dt;
	float left = Tcenter - Dt;
	if (Circle)
	{
		if((s - Scenter)*(s - Scenter) + (t - Tcenter)*(t - Tcenter) < (Ds) * (Ds) )
		{
			s = s - Scenter;
			t = t - Tcenter;
			s = s * 1.0 / MagFactor;
			t = t * 1.0 / MagFactor;
			float X = s*cos(RotAngle) - t*sin(RotAngle) + Scenter;
			float Y = s*sin(RotAngle) + t*cos(RotAngle) + Tcenter;

			vec2 m = vec2(X,Y);
			vec3 n = texture2D(ImageUnit, m).rgb;
			
			vec2 stp0 = vec2(1./ResS,  0. );
			vec2 st0p = vec2(0.     ,  1./ResT);
			vec2 stpp = vec2(1./ResS,  1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 =   texture2D( ImageUnit, m ).rgb;
			vec3 im1m1 = texture2D( ImageUnit, m-stpp ).rgb;
			vec3 ip1p1 = texture2D( ImageUnit, m+stpp ).rgb;
			vec3 im1p1 = texture2D( ImageUnit, m-stpm ).rgb;
			vec3 ip1m1 = texture2D( ImageUnit, m+stpm ).rgb;
			vec3 im10 =  texture2D( ImageUnit, m-stp0 ).rgb;
			vec3 ip10 =  texture2D( ImageUnit, m+stp0 ).rgb;
			vec3 i0m1 =  texture2D( ImageUnit, m-st0p ).rgb;
			vec3 i0p1 =  texture2D( ImageUnit, m+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4( mix( target, n, SharpFactor ), 1. );
		}
		else{
			gl_FragColor = vec4( color, 1. );
		}
	} else{
		float top = Scenter + Ds;
		float bottom = Scenter - Ds;
		float right = Tcenter + Dt;
		float left = Tcenter - Dt;
		if( s < top && s > bottom && t > left && t < right )
		{
			s = s - Scenter;
			t = t - Tcenter;
			s = s * 1.0 / MagFactor;
			t = t * 1.0 / MagFactor;
			float X = s*cos(RotAngle) - t*sin(RotAngle) + Scenter;
			float Y = s*sin(RotAngle) + t*cos(RotAngle) + Tcenter;
			vec2 m = vec2(X,Y);
			vec3 n = texture2D(ImageUnit, m).rgb;
			
			vec2 stp0 = vec2(1./ResS,  0. );
			vec2 st0p = vec2(0.     ,  1./ResT);
			vec2 stpp = vec2(1./ResS,  1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 =   texture2D( ImageUnit, m ).rgb;
			vec3 im1m1 = texture2D( ImageUnit, m-stpp ).rgb;
			vec3 ip1p1 = texture2D( ImageUnit, m+stpp ).rgb;
			vec3 im1p1 = texture2D( ImageUnit, m-stpm ).rgb;
			vec3 ip1m1 = texture2D( ImageUnit, m+stpm ).rgb;
			vec3 im10 =  texture2D( ImageUnit, m-stp0 ).rgb;
			vec3 ip10 =  texture2D( ImageUnit, m+stp0 ).rgb;
			vec3 i0m1 =  texture2D( ImageUnit, m-st0p ).rgb;
			vec3 i0p1 =  texture2D( ImageUnit, m+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4( mix( target, n, SharpFactor ), 1. );
		}
		else
		{
			gl_FragColor = vec4( color, 1. );
		}
	}
	
	

}