import { StackNavigator } from 'react-navigation';
import Startup from './components/StartupComponent';

const App = StackNavigator({
    Startup: {
        screen: Startup
    }
});

export default App;
