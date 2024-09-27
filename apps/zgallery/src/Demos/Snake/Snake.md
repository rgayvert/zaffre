Snakes is another classic arcade game. There is a fixed-size board, in this case 15 rows by 21 columns, along with a single snake comprised of a sequence of blocks and a single pellet. When the head of the snake encounters the pellet, an additional block is added to the snake. The pellet then appears somewhere else on the board. The goal is to maneuver the head of the snake using the arrow keys in order to make the snake as long as possible. When the snake hits a wall, the game is over. 

The UI (SnakeBoard.ts) is very simple. There is an SVGRectangle for main box, a start/stop button, and an SVGCircle for the pellet. The snake is generated using a ViewList that creates an SVGRectangle for each segment of the snake.

The model runs the animation, which contains a single item, the snake. The snake starts out at a random location with a length of 5 blocks. In this example the velocity of the snake is constant, so at each step of the animation the head of the snake is moved one block in the direction of the current or last arrow key held down. The subsequent segments of the snake then follow to keep the snake segments continguous. 