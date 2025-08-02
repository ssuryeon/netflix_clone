import {useQuery} from 'react-query';
import {getMovies, IGetMoviesResult} from '../api';
import styled from 'styled-components';
import {makeImagePath} from '../utils';
import {useState} from 'react';
import {motion, AnimatePresence, Variants} from 'framer-motion';
import {useHistory, useRouteMatch} from 'react-router-dom';

const Wrapper = styled.div`
    background: black;
`;
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    color: white;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
    background-size: cover;
`;
const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;
const Overview = styled.p`
    font-size: 20px;
    width: 50%;
`;
const Slider = styled.div`
    position: relative;
    top: -100px;
`;
const Row = styled(motion.div)`
    position: absolute;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    width: 100%;
    gap: 10px;
`;
const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color: white;
    height: 200px;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    } // 맨 왼쪽과 맨 오른쪽에 있는 box는 상하좌우로 커지지 않고 왼쪽/오른쪽으로만 커지게
`;
const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    position: absolute;
    width: 100%;
    bottom: 0;
    color: white;
    text-align: center;
    opacity: 0;
`;

const rowVars:Variants = {
    hidden: {
        x: window.innerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.innerWidth,
    },
}

const boxVars:Variants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        transition: {
            type: "tween",
            delay: 0.3, // 마우스를 올릴 때만 딜레이가 있고 내릴 때는 딜레이가 없도록 hover시에만 설정
        },
        y: -80,
    }
}

const infoVars:Variants = {
    hover: {
        opacity: 1,
        transition: {
            type: "tween",
            delay: 0.3,
        },
    }
}

function Home(){
    const {data, isLoading} = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
    console.log(data, isLoading);
    const bigMovieMatch = useRouteMatch<{movieId:string}>('/movies/:movieId');
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving(prev => !prev);
    const increaseIndex = () => {
        if(data){
            if(leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const offset = 6;
    const history = useHistory();
    const onBoxClicked = (movieId:number) => {
        history.push(`/movies/${movieId}`); // 해당 경로로 이동
    }
    return (
        <Wrapper>
            {isLoading? <Loader>Loading...</Loader> : 
                <>
                    <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                            <Row key={index} // Row의 내용은 그대로고 key값만 바뀜, 이로 인해 새로운 컴포넌트가 생성된 것처럼 판단되어 애니메이션이 적용됨
                                variants={rowVars} // x축만 이동시키는 애니메이션
                                initial="hidden" 
                                animate="visible" 
                                exit="exit"
                                transition={{type: "tween", duration: 1}}
                            >
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map(movie => 
                                    <Box key={movie.id}
                                        layoutId={movie.id + ""} 
                                        variants={boxVars} 
                                        initial="normal" 
                                        whileHover="hover" // Info에도 상속되기 때문에 따로 설정 안해줘도 됨
                                        transition={{type: "tween"}}
                                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                        onClick={() => onBoxClicked(movie.id)} // 파라미터가 있는 함수를 넣으려면 화살표함수로 감싸야 함
                                    >
                                        <Info variants={infoVars}>{movie.title}</Info>
                                    </Box>
                                )}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        { bigMovieMatch ? (
                            <motion.div
                                layoutId={bigMovieMatch.params.movieId}
                                style={{
                                    position: "absolute",
                                    width: "40vw",
                                    height: "80vh",
                                    backgroundColor: "red",
                                    top: 50,
                                    left: 0,
                                    right: 0,
                                    margin: "0 auto",
                                }}
                            ></motion.div>
                        ) : null}
                    </AnimatePresence>
                </>
            }
        </Wrapper>
    );
}

export default Home;