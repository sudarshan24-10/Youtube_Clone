import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import axios from "axios";
import { List } from "react-virtualized";
import { toast } from "react-toastify";


const Container = styled.div`
overflow: auto
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap:1rem;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
  border-bottom: ${({ isFocused }) => (!isFocused ? `2px solid ${({ theme }) => theme.text}` : `1px solid #ccc`)};
`;
 const AddButton = styled.div`
  display: flex;
  gap:2rem;
  justify-content: flex-end;
 `;

const Comments = ({videoId}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const handleFocus = () => {
    setIsFocused(true);
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        console.log(res.data)
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId,inputRef.current]);

  const addCommentRequest={
    videoId: videoId,
    desc:input

  }
  const handleAddComment= async(e)=>{
    if(input===""){
      toast.error("Please add a comment");
      return;
    }

    if(currentUser===null){
      toast.error("Please signin to add a comment");
      return;
    }
    try{
      const res=await axios.post("/comments/",addCommentRequest);
      console.log(res);
      window.location.reload();
    }catch(err){
      toast.error('Some issue with adding comments');
    }
  }

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img} atl="channelImg" />
        <Input
        onChange={(e)=>{setInput(e.target.value)}}
        isFocused={isFocused}
        onClick={handleFocus}
        placeholder="Add a comment..."/>
        
      </NewComment>
      {isFocused && <AddButton>
          <div onClick={handleAddComment} className="add">Add comment</div>
        </AddButton>}
       {comments.map(comment=>(
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  );
};

export default Comments;