import styled from 'styled-components';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from '../Components/Comments';
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { dislike,fetchSuccess, like } from '../redux/videoSlice';
import { format } from 'timeago.js';
import { subscription } from '../redux/userSlice';
import Recommendation from "../Components/Recommendations";
import Loading from '../utils/loading';
import ErrorComponent from '../utils/Error';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const Container = styled.div`
display:flex;
gap:10rem;
margin-top:10px;
`;

const Content=styled.div`
flex:5;
`;

const VideoWrapper=styled.div`
    
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
margin-top:-5px;
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const VideoFrame = styled.video`
z-index:100;
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const VideoPage = () => {
  const currentUrl = window.location.href;
  const urlId=currentUrl.split('/')[4];
  const {currentUser}=useSelector((state)=>state.user);
  const {currentVideo} = useSelector((state)=>state.video);
  const dispatch=useDispatch();
  const path= useLocation().pathname.split('/')[2];
  const [channel,setChannel]=useState({});
  const [error,setError]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const fetchData=async ()=>{
      try{
        const res=await axios.get(`/api/videos/find/${path}`);
        const channelRes=await axios.get(`/api/users/find/${res.data.userId}`);
        
        dispatch(fetchSuccess(res.data));
        setLoading(false);
        setChannel(channelRes.data);
      }catch(e){
        setError(true);
      }
    }
    fetchData();
  },[path,dispatch]);
  const handleLike = async () => {
    try{
      await axios.put(`/api/users/like/${currentVideo._id}`,{
      });
      dispatch(like(currentUser._id));
    }catch(e){
      toast.error("Please signin to like or dislike");
    }
  };
  const handleDislike = async () => {
    try{
      await axios.put(`/api/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
    }catch(e){
      toast.error("Please signin to like or dislike");
    }
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copied to clipboard!");
  };
  const handleSub = async () => {
    try{
      currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/api/users/unsub/${channel._id}`)
      : await axios.put(`/api/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
    }catch(e){
      toast.error("Please Signin to subscribe to the channel");
    }
  };
  return (
    <>
    {currentVideo._id===urlId?<Helmet><title>{currentVideo.title}</title></Helmet>:<Helmet><title>Yuutube</title></Helmet>}
    <Container>
      {loading?<Loading></Loading>:error?<ErrorComponent></ErrorComponent>:<Content>
      <VideoWrapper>
      <VideoFrame src={currentVideo.videoUrl} controls autoPlay />
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
          <Info> {currentVideo.views} views • {format(currentVideo.createdAt)}</Info>
          <Buttons>
          <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button onClick={handleShare}>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} alt='channel img' />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>
              {currentVideo.desc}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser?.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id}></Comments>
      </Content>}
      <Recommendation className="recomendation" tags={currentVideo?.tags}/>
    </Container>
    </>
  )
}

export default VideoPage