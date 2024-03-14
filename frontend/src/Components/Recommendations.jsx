import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({tags}) => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const res=await axios.get(`/api/videos/tags?tags=${tags}`);
      console.log(res.data);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video,i) => (
        <Card type="sm" key={i} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;