surface
dots( float
Ad = 0.05, 
Bd = 0.02,  // Elliptical diameters
Ks = 0.5,
Kd = 0.5,
Ka = 0.1,
NoiseAmp = 0.10,
NoiseFreq = 1.00,
roughness = 0.1;
color specularColor = color( 1, 1, 1 )
)
{
point PP = point "shader" P;
float magnitude = 0.;
float size = 1.;
float i;
for(i = 0.; i < 6.0; i += 1.0)
{
	magnitude += (noise(NoiseFreq * size * PP) - 0.5) /size;
	size *= 2.0;
}
float up = 2. * u;
float vp = v;
up += NoiseAmp*magnitude;
vp += NoiseAmp*magnitude;
float numinu = floor( up / (2 * Ad) );
float numinv = floor( vp / (2 * Bd) );
color dotColor = Cs;
if( mod( numinu+numinv, 2 ) == 0 )
{
float uc = numinu*2. * Ad + Ad;
float vc = numinv*2. * Bd + Bd;
up = (up - uc)/Ad;
vp = (vp - vc)/Bd;
point upvp = point( up, vp, 0. );
point cntr = point( 0., 0., 0. );
vector delta = upvp - cntr;		
float oldrad = length(delta);	
float newrad = oldrad + magnitude;
delta = delta * newrad / oldrad;
float deltau = xcomp(delta);
float deltav = ycomp(delta);
float d = pow(deltau,2) + pow(deltav,2);
if( d <= 1. )
{
	dotColor = color( 1., .5, 0. );
}
}
varying vector Nf = faceforward( normalize( N ), I );
vector V = normalize( -I );
Oi = 1.;
Ci = Oi * ( dotColor * ( Ka * ambient() + Kd * diffuse(Nf) ) +
specularColor * Ks * specular( Nf, V, roughness ) );
}