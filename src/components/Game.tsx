import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Colors } from '../styles/colors';
import { StyleSheet } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Coordinate, Direction, GestureEventType } from '../types/types';
import Snake from './Snake';
import { StatusBar } from 'expo-status-bar';
import { checkGameOver } from '../utils/checkGameOver';
import Food from './Food';
import { checkEatsFood } from '../utils/checkEatsFood';
import { randomFoodPosition } from '../utils/randomPositionFood';



const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 69, yMin: 0, yMax: 50 }
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;



export default function Game(): JSX.Element {

    const [direction, setDirection] = React.useState<Direction>(Direction.Right);
    const [snake, setSnake] = React.useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
    const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
    const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    const [score, setScore] = React.useState<number>(0);


    React.useEffect(() => {
        if (!isGameOver) {
            const intervalId = setInterval(() => {
                !isPaused && moveSnake();
            }, MOVE_INTERVAL);
            return () => clearInterval(intervalId);
        }
    }, [snake, isGameOver, isPaused]);


    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = { ...snakeHead } //Creating a copy

        // Game Over
        if (checkGameOver(snakeHead, GAME_BOUNDS)) {
            setIsGameOver((prev) => !prev);
            return;
        }


        switch (direction) {
            case Direction.Up:
                newHead.y -= 1;
                break;
            case Direction.Down:
                newHead.y += 1;
                break;
            case Direction.Left:
                newHead.x -= 1;
                break;
            case Direction.Right:
                newHead.x += 1;
                break;
            default:
                break;
        }

        if (checkEatsFood(newHead, food, 2)) {
            setSnake([newHead, ...snake]);
            // get another position for the food
            setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax))
            setScore(score + SCORE_INCREMENT);
        }else{
            setSnake([newHead, ...snake.slice(0, -1)]);
        }


    };


    const handleGesture = (event: GestureEventType) => {

        const { translationX, translationY } = event.nativeEvent;
        console.log(translationX, translationY);

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {
                // moving right
                setDirection(Direction.Right)
            } else {
                // moving left
                setDirection(Direction.Left)
            }
        } else {
            if (translationY > 0) {
                // moving down
                setDirection(Direction.Down)
            } else {
                // moving up
                setDirection(Direction.Up)
            }
        }

        <StatusBar />
    }

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
                <View style={styles.boundaries}>
                    <Snake snake={snake} />
                    <Food x={food.x} y={food.y} />
                </View>
            </SafeAreaView>
        </PanGestureHandler>

    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    boundaries: {
        flex: 1,
        borderColor: Colors.primary,
        borderWidth: 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: Colors.background,
    },
});
