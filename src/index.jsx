import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

let timer = 10

class CpsTestBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { timer: timer, clicks: 0, inGame: false, message: "Click here to start", endMessage: "Click the box to start" };

        this.clickCooldown = 0;
        this.lastClick = null;
        this.startTimer = timer;
    }

    tick() {
        // Count down the timer
        if (this.state.inGame) {
            this.setState({ timer: this.state.timer - 1, endMessage: `${this.state.timer} remaining` });

            if (this.state.timer === 0) {
                this.setState({ inGame: false, clicks: 0 });

                // Announce the result
                this.setState({ inGame: false, endMessage: `You got ${this.state.clicks / this.startTimer} CPS (${this.state.clicks} in ${this.startTimer} seconds)` });
                this.clickCooldown = 1;

                this.setState({ timer: timer })
            }
        }
    }

    updateClicks() {
        if (this.state.inGame) {
            this.setState({ message: this.state.clicks });
        } else {
            this.setState({ timer: timer });
        }
    }

    componentDidMount() {
        this.timerId = setInterval(
            () => this.tick(),
            1000
        );

        this.updateClicksTask = setInterval(
            () => this.updateClicks(),
            10
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
        clearInterval(this.updateClicksTask);
    }

    onClick() {
        if (this.clickCooldown > 0) {
            let current = new Date();
            if (this.lastClick != null) {
                if (((current.getTime() - this.lastClick.getTime())) > this.clickCooldown * 1000 ) {
                    this.clickCooldown = 0;
                }
            }
        } else {
            this.lastClick = new Date()
            if (this.state.inGame) {
                this.setState({ clicks: this.state.clicks + 1 });
            } else {
                // Start the game
                this.setState({ inGame: true });
                this.startTimer = timer; 
            }
        }
    }

    render() {
        return (
            <div>
                <div>
                    <span className='cps-test' onClick={() => this.onClick()}>
                        <span className="message">
                            {this.state.message}
                        </span>
                    </span>
                </div>
                <span className="subtitle">
                    {this.state.endMessage}
                </span>
            </div>
        );
    }
}

class GameModeBox extends React.Component {
    onClick() {
        timer = this.props.duration;
    }

    render () {
        return (
            <span className='gamemode-button' onClick={() => this.onClick()}>
                {this.props.duration} second test
            </span>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="game height-100">
                <div className="gamemode-menu">
                    <GameModeBox duration="1" />
                    <GameModeBox duration="5" />
                    <GameModeBox duration="10" />
                    <GameModeBox duration="100" />
                </div>
                <div className="game-container">
                    <CpsTestBox />
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(<App />);