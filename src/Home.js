
import { useHistory } from 'react-router-dom';
import elnour from './Images/ElnourPic.png';


const Home = ({userName = ""}) => {

    const history = useHistory();

    return (
        
        <div className="home">
            <div className = "pictureDiv">
                <img className="picture" src={elnour} alt="" />
                <h2>Heter jag Elnour?</h2>
            </div>
            <button onClick={() => history.push('/EnterName')}>Start chat with Elnour!</button>
        </div>
        
    );
}

export default Home;