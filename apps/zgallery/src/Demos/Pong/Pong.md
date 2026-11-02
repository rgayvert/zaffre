
This is a simple implementation of the classic Pong game. SVG components are used 
for the parts, including the ball and paddles, which are moved using translations on the 
item locations.

The model is an AnimationModel containing the ball and paddles. The ball is given an initial
location and velocity, and a simple set of rules dictates how the ball velocity changes when it hits one of the paddles or the top and bottom edges.

The right paddle is controlled by the user by moving the pointer up or down. The left paddle is moved automatically by moving at a fixed speed toward where the ball is expected to hit.