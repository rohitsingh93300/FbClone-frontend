import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import userLogo from "../assets/user.jpg"
import { Textarea } from './ui/textarea'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { BsThreeDots } from 'react-icons/bs'
import axios from 'axios'
import { toast } from 'sonner'

const CommentBox = ({ post, formatFBTime }) => {
    const { user } = useSelector(store => store.auth)
    const [content, setContent] = useState("")
    
    const postCommentHandler = async (id) => {
        try {
            const res = await axios.post(`https://fb-clone-backend-dun.vercel.app/api/v1/comment/${id}/create`, { content }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            if (res.data.success) {
                setContent("")
                toast.success(res.data.message)

            }
        } catch (error) {
            console.log(error);

        }
    }
  
    const deleteCommentHandler = async(id)=>{
        try {
            const res = await axios.delete(`https://fb-clone-backend-dun.vercel.app/api/v1/comment/${id}/delete`, {
                withCredentials: true
            })
            if (res.data.success) {
                toast.success(res.data.message)

            }
        } catch (error) {
            console.log(error);
            toast.error('Comment not deleted')
            
        }
    }

    const likeCommentHandler = async (commentId) =>{
        try {
            const res = await axios.post(`https://fb-clone-backend-dun.vercel.app/api/v1/comment/${commentId}/like`, {}, {
                withCredentials: true
            })
            if (res.data.success) {
                toast.success(res.data.message)

            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            
        }
    }
    return (
        <div className='mt-4'>
            <hr />
            <div className='flex gap-2 mt-4'>
                <Avatar>
                    <AvatarImage src={user?.profilePicture || userLogo} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Textarea className='p-3 bg-[#e4e6eb]'
                    placeholder={`Comment as ${user.firstname}`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <PiPaperPlaneRightFill onClick={()=>postCommentHandler(post._id)} className='h-8 w-8 cursor-pointer' />
            </div>
            <div className='mt-3 space-y-3'>
                {
                    post?.comments?.map((comment) => {
                        return <div key={comment._id} className='flex items-center justify-between'>
                            <div>
                                <div className='flex items-center gap-3'>
                                    <Avatar>
                                        <AvatarImage src={comment?.userId?.profilePicture || userLogo} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className='p-3 rounded-2xl dark:bg-[#303233] bg-[#e4e6eb]'>
                                            <h1>{comment?.userId?.firstname} {comment?.userId?.lastname}</h1>
                                            <p>{comment.content}</p>
                                        </div>
                                        <div className='flex gap-6 px-2 mt-1 items-center'>
                                            <p>{formatFBTime(comment.createdAt)}</p>
                                            <p onClick={()=>likeCommentHandler(comment._id)} className={`${comment.likes?.includes(user._id) ? 'text-blue-500 font-semibold' : ''} cursor-pointer`}>Like</p>
                                            <p>Reply</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='p-2 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#303233] cursor-pointer'>
                                    <BsThreeDots />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={()=>deleteCommentHandler(comment._id)}>Delete</DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default CommentBox
